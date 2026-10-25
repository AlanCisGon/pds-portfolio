"use client";

import { Check, Microphone, MicrophoneMute, SoundHigh } from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Callout, Chip, Gauge } from "@/sds";
import styles from "./Tuner.module.css";
import { STRINGS, centsOf, createDetector, median, nearestString } from "./pitch";

type Tone = "idle" | "low" | "high" | "ok" | "far";
type Mode = "auto" | "manual";

// Headstock seen from the front: 4-5-6 on the left, 3-2-1 on the right, top to bottom.
const LEFT = [2, 1, 0];
const RIGHT = [3, 4, 5];

const IN_TUNE = 4; // cents
const HOLD_MS = 700; // in tune this long before it counts
const SILENCE_MS = 800;
const DETECT_MS = 45;

type View = {
  tone: Tone;
  status: string;
  freq: number | null;
  cents: number | null;
};

function idleStatus(running: boolean, mode: Mode, sel: number) {
  if (!running) return "Activa el micrófono y toca una cuerda al aire";
  return mode === "manual"
    ? `Toca la ${STRINGS[sel].ord} cuerda (${STRINGS[sel].name})`
    : "Toca una cuerda al aire";
}

export function Tuner() {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("auto");
  const [sel, setSel] = useState(0);
  const [current, setCurrent] = useState<number | null>(null);
  const [tuned, setTuned] = useState<Set<number>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [needle, setNeedle] = useState<number | null>(null);
  const [view, setView] = useState<View>({
    tone: "idle",
    status: idleStatus(false, "auto", 0),
    freq: null,
    cents: null,
  });

  // The audio loop reads and writes these without re-rendering.
  const audio = useRef<{
    ctx: AudioContext | null;
    stream: MediaStream | null;
    source: MediaStreamAudioSourceNode | null;
    wakeLock: WakeLockSentinel | null;
    raf: number;
  }>({ ctx: null, stream: null, source: null, wakeLock: null, raf: 0 });
  const loop = useRef({
    mode: "auto" as Mode,
    sel: 0,
    current: null as number | null,
    hist: [] as number[],
    hasSignal: false,
    lastPitchAt: 0,
    lastDetect: 0,
    inTuneSince: 0,
    target: 0,
    shown: 0,
  });

  const reset = useCallback((isRunning: boolean, m: Mode, s: number) => {
    Object.assign(loop.current, { hist: [], hasSignal: false, inTuneSince: 0 });
    setView({ tone: "idle", status: idleStatus(isRunning, m, s), freq: null, cents: null });
  }, []);

  const ensureCtx = useCallback(() => {
    const a = audio.current;
    if (!a.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      a.ctx = new AC();
    }
    if (a.ctx.state === "suspended") void a.ctx.resume();
    return a.ctx;
  }, []);

  /** A plucked reference: six decaying harmonics, three seconds. */
  const playRef = useCallback(
    (freq: number) => {
      const ctx = ensureCtx();
      const t = ctx.currentTime + 0.02;
      const dur = 3.2;
      const out = ctx.createGain();
      out.gain.setValueAtTime(0.0001, t);
      out.gain.exponentialRampToValueAtTime(0.4, t + 0.012);
      out.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      out.connect(ctx.destination);
      for (let h = 1; h <= 6; h++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.value = freq * h;
        g.gain.setValueAtTime(0.55 / h ** 1.5, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur / (0.7 + h * 0.35));
        osc.connect(g).connect(out);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      }
    },
    [ensureCtx],
  );

  const stop = useCallback(() => {
    const a = audio.current;
    if (!a.stream) return;
    cancelAnimationFrame(a.raf);
    for (const t of a.stream?.getTracks() ?? []) t.stop();
    a.source?.disconnect();
    void a.wakeLock?.release().catch(() => {});
    Object.assign(a, { stream: null, source: null, wakeLock: null });
    loop.current.shown = 0;
    setRunning(false);
    setNeedle(null);
    Object.assign(loop.current, { hist: [], hasSignal: false, inTuneSince: 0 });
    setView({ tone: "idle", status: "Micrófono apagado", freq: null, cents: null });
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Este navegador no permite usar el micrófono aquí. Puedes afinar de oído con “Escuchar”: toca la nota y ajusta la cuerda hasta que suenen igual.",
      );
      return;
    }
    const ctx = ensureCtx();
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      const name = (e as DOMException | undefined)?.name;
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "No se pudo usar el micrófono. Revisa el permiso de micrófono del navegador en Ajustes. Mientras, puedes afinar de oído con “Escuchar”."
          : "No se encontró un micrófono disponible. Puedes afinar de oído con “Escuchar”.",
      );
      return;
    }
    await ctx.resume();
    const a = audio.current;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;
    a.stream = stream;
    a.source = ctx.createMediaStreamSource(stream);
    a.source.connect(analyser);
    const buf = new Float32Array(analyser.fftSize);
    const detect = createDetector(analyser.fftSize, ctx.sampleRate);
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    setRunning(true);
    reset(true, loop.current.mode, loop.current.sel);
    try {
      a.wakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      // Keeping the screen on is a nicety; the tuner works without it.
    }

    const process = (now: number) => {
      const s = loop.current;
      analyser.getFloatTimeDomainData(buf);
      const f = detect(buf);
      if (!f) {
        if (s.hasSignal && now - s.lastPitchAt > SILENCE_MS) reset(true, s.mode, s.sel);
        return;
      }
      // A jump of more than 6 % is a new note: start the median over.
      if (s.hist.length && Math.abs(f / median(s.hist) - 1) > 0.06) s.hist = [];
      s.hist.push(f);
      if (s.hist.length > 5) s.hist.shift();
      const fm = median(s.hist);
      const i = s.mode === "manual" ? s.sel : nearestString(fm);
      if (i !== s.current) {
        s.inTuneSince = 0;
        s.current = i;
        setCurrent(i);
      }
      let c = centsOf(fm, STRINGS[i].freq);
      // On a chosen string, an octave harmonic still counts as that string.
      if (s.mode === "manual") {
        if (Math.abs(c - 1200) < 60) c -= 1200;
        else if (Math.abs(c + 1200) < 60) c += 1200;
      }
      s.target = c;
      s.hasSignal = true;
      s.lastPitchAt = now;

      const abs = Math.abs(c);
      const str = STRINGS[i];
      let tone: Tone;
      let status: string;
      if (s.mode === "manual" && abs > 300) {
        s.inTuneSince = 0;
        tone = "far";
        status = `Eso no suena como la ${str.ord} cuerda`;
      } else if (abs <= IN_TUNE) {
        if (!s.inTuneSince) s.inTuneSince = now;
        tone = "ok";
        status = now - s.inTuneSince > HOLD_MS ? "Afinada" : "Casi…";
        if (status === "Afinada") setTuned((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
      } else {
        s.inTuneSince = 0;
        tone = c < 0 ? "low" : "high";
        status =
          c < 0
            ? abs > 20
              ? "Muy grave: tensa la cuerda"
              : "Un poco grave: tensa apenas"
            : abs > 20
              ? "Muy aguda: afloja la cuerda"
              : "Un poco aguda: afloja apenas";
      }
      setView({ tone, status, freq: fm, cents: c });
    };

    const frame = (now: number) => {
      const s = loop.current;
      if (now - s.lastDetect > DETECT_MS) {
        s.lastDetect = now;
        process(now);
      }
      // The needle settles toward the reading; with reduced motion it jumps.
      const goal = s.hasSignal ? Math.max(-50, Math.min(50, s.target)) : 0;
      s.shown += (goal - s.shown) * (reduceMotion ? 1 : 0.22);
      setNeedle(s.hasSignal ? s.shown : null);
      a.raf = requestAnimationFrame(frame);
    };
    a.raf = requestAnimationFrame(frame);
  }, [ensureCtx, reset]);

  // Leaving the tab turns the microphone off; unmounting closes everything.
  useEffect(() => {
    const a = audio.current;
    const onHide = () => {
      if (document.hidden && a.stream) stop();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      stop();
      void a.ctx?.close();
      a.ctx = null;
    };
  }, [stop]);

  const changeMode = (m: Mode, s = sel) => {
    loop.current.mode = m;
    loop.current.sel = s;
    setMode(m);
    setSel(s);
    if (m === "auto" && !running) setCurrent(null);
    reset(running, m, s);
  };

  const onPeg = (i: number) => {
    if (mode === "manual" && sel === i) {
      changeMode("auto");
      return;
    }
    loop.current.current = i;
    setCurrent(i);
    changeMode("manual", i);
    if (!running) playRef(STRINGS[i].freq);
  };

  const shownIndex = mode === "manual" ? sel : current;
  const shownString = shownIndex === null ? null : STRINGS[shownIndex];
  const refString = STRINGS[shownIndex ?? 0];
  const cents = view.cents;
  const centsText =
    cents === null
      ? ""
      : Math.abs(cents) < 0.5
        ? "0 cents"
        : `${cents > 0 ? "+" : "−"}${Math.round(Math.abs(cents))} cents`;

  const peg = (i: number) => {
    const s = STRINGS[i];
    return (
      <Chip
        key={i}
        className={styles.peg}
        label={`${s.ord} · ${s.name}`}
        selected={mode === "manual" && sel === i}
        trailingIcon={tuned.has(i) ? <Check /> : undefined}
        onClick={() => onPeg(i)}
      />
    );
  };

  return (
    <div className={styles.tuner} data-tone={view.tone}>
      <Gauge
        value={needle}
        zone={5}
        tone={view.tone === "ok" ? "success" : view.tone === "far" ? "danger" : "neutral"}
        label="Desviación de la cuerda, en cents"
        valueText={centsText || "Sin lectura"}
      >
        <span className={styles.note}>{shownString?.name ?? "–"}</span>
        <span className={styles.sub}>
          {shownString
            ? `${shownString.ord} cuerda, ${shownString.freq.toFixed(1)} Hz`
            : "Elige una cuerda o toca una al aire"}
        </span>
      </Gauge>

      <p className={styles.status} aria-live="polite">
        {view.status}
      </p>
      <p className={styles.detail}>
        <span>{centsText}</span>
        <span>{view.freq ? `${view.freq.toFixed(1)} Hz` : ""}</span>
      </p>

      <Button
        className={styles.main}
        leadingIcon={running ? <MicrophoneMute /> : <Microphone />}
        onClick={() => (running ? stop() : void start())}
      >
        {running ? "Detener micrófono" : "Activar micrófono"}
      </Button>

      {error && (
        <Callout tone="warning" title="Sin micrófono">
          {error}
        </Callout>
      )}

      <div className={styles.row}>
        <Chip
          label="Automático"
          selected={mode === "auto"}
          onClick={() => changeMode(mode === "auto" ? "manual" : "auto")}
        />
        <Button
          variant="secondary"
          leadingIcon={<SoundHigh />}
          onClick={() => playRef(refString.freq)}
        >
          {`Escuchar ${refString.name} (${refString.ord})`}
        </Button>
      </div>

      <fieldset className={styles.head}>
        <legend className={styles.legend}>Elegir cuerda</legend>
        <div className={styles.pegs} data-side="left">
          {LEFT.map(peg)}
        </div>
        <div className={styles.plate} aria-hidden="true">
          {[LEFT, RIGHT].map((col) => (
            <span key={col[0]} className={styles.slot}>
              {col.map((i) => (
                <span
                  key={i}
                  className={styles.roller}
                  data-active={shownIndex === i || undefined}
                />
              ))}
            </span>
          ))}
        </div>
        <div className={styles.pegs} data-side="right">
          {RIGHT.map(peg)}
        </div>
      </fieldset>

      <p className={styles.hint}>
        Toca una cuerda de la cabeza para fijarla; tócala otra vez para volver a automático. Si la
        nota de referencia no se oye, quita el modo silencio del iPhone.
      </p>
    </div>
  );
}
