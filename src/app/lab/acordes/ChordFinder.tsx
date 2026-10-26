"use client";

import { Microphone, MicrophoneMute } from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Callout, Chip, ChordDiagram, Link, Tab } from "@/sds";
import { type Chord, type Voicing, chordOf, notesIn, pcName, voicings } from "../_guitar/chords";
import { DEFAULT_A4 } from "../_guitar/pitch";
import { useGuitarSettings } from "../_guitar/settings";
import styles from "./ChordFinder.module.css";

const FFT = 16384; // ≈ 2.9 Hz per bin at 48 kHz: enough to split low notes a semitone apart
const EVERY_MS = 120;
const CONFIRM = 3; // the same chord in this many of the last four reads
const SILENCE_MS = 400;
const MIN_RMS = 0.004;
const NOISE_GATE = 4;

type Found = { chord: Chord; lowest: number; notes: number[] };

export function ChordFinder() {
  const { tuning, a4, strings } = useGuitarSettings();
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [found, setFound] = useState<Found | null>(null);
  const [held, setHeld] = useState(false);
  const [choice, setChoice] = useState(0);

  const audio = useRef<{
    ctx: AudioContext | null;
    stream: MediaStream | null;
    source: MediaStreamAudioSourceNode | null;
    wakeLock: WakeLockSentinel | null;
    timer: number;
  }>({ ctx: null, stream: null, source: null, wakeLock: null, timer: 0 });
  const a4Ref = useRef(a4);
  useEffect(() => {
    a4Ref.current = a4;
  }, [a4]);

  const stop = useCallback(() => {
    const a = audio.current;
    if (!a.stream) return;
    window.clearInterval(a.timer);
    for (const t of a.stream.getTracks()) t.stop();
    a.source?.disconnect();
    void a.wakeLock?.release().catch(() => {});
    Object.assign(a, { stream: null, source: null, wakeLock: null });
    setRunning(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no permite usar el micrófono aquí.");
      return;
    }
    const a = audio.current;
    if (!a.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      a.ctx = new AC();
    }
    const ctx = a.ctx;
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      const name = (e as DOMException | undefined)?.name;
      setError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "No se pudo usar el micrófono. Revisa el permiso de micrófono del navegador en Ajustes."
          : "No se encontró un micrófono disponible.",
      );
      return;
    }
    await ctx.resume();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT;
    analyser.smoothingTimeConstant = 0;
    a.stream = stream;
    a.source = ctx.createMediaStreamSource(stream);
    a.source.connect(analyser);
    setRunning(true);
    try {
      a.wakeLock = (await navigator.wakeLock?.request("screen")) ?? null;
    } catch {
      // Keeping the screen on is a nicety.
    }

    const wave = new Float32Array(FFT);
    const db = new Float32Array(FFT / 2);
    const mag = new Float32Array(FFT / 2);
    const recent: (string | null)[] = [];
    let floor = 0;
    let lastHeard = 0;
    let shown: string | null = null;
    let isHeld = false;

    a.timer = window.setInterval(() => {
      const now = performance.now();
      analyser.getFloatTimeDomainData(wave);
      let sum = 0;
      for (let i = 0; i < wave.length; i++) sum += wave[i] * wave[i];
      const rms = Math.sqrt(sum / wave.length);
      floor = floor === 0 || rms < floor ? rms : floor * 1.003;

      let result: Found | null = null;
      if (rms >= Math.max(MIN_RMS, floor * NOISE_GATE)) {
        analyser.getFloatFrequencyData(db);
        for (let i = 0; i < db.length; i++) mag[i] = 10 ** (db[i] / 20);
        const notes = notesIn(mag, ctx.sampleRate, FFT, a4Ref.current);
        const chord = chordOf(notes);
        if (chord) {
          const strong = notes.filter((n) => n.salience >= notes[0].salience * 0.3);
          result = {
            chord,
            lowest: Math.min(...strong.map((n) => n.midi)),
            notes: [...new Set(notes.map((n) => n.midi % 12))],
          };
        }
      }

      recent.push(result?.chord.symbol ?? null);
      if (recent.length > 4) recent.shift();
      if (result) {
        lastHeard = now;
        const votes = recent.filter((s) => s === result.chord.symbol).length;
        if (votes >= CONFIRM && (result.chord.symbol !== shown || isHeld)) {
          if (result.chord.symbol !== shown) setChoice(0);
          shown = result.chord.symbol;
          isHeld = false;
          setHeld(false);
          setFound(result);
        }
      } else if (shown && !isHeld && now - lastHeard > SILENCE_MS) {
        // The chord rang out: keep it on screen until the next one.
        isHeld = true;
        setHeld(true);
      }
    }, EVERY_MS);
  }, []);

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

  const shapes: Voicing[] = found ? voicings(found.chord, tuning.midi) : [];
  // The shape whose lowest note is the bass that was heard goes first.
  const ordered = [...shapes].sort(
    (x, y) => Number(y.lowest === found?.lowest) - Number(x.lowest === found?.lowest),
  );
  const shape = ordered[Math.min(choice, ordered.length - 1)];
  const names = strings.map((s) => s.name);
  const fretWords = (v: Voicing) => v.frets.map((f) => (f === null ? "x" : f)).join(" ");

  return (
    <div className={styles.finder} data-held={held || undefined}>
      <p className={styles.tuning}>
        {`Afinación: ${tuning.label}${a4 === DEFAULT_A4 ? "" : ` · La ${a4} Hz`} · `}
        <Link href="/lab/afinador">Cambiar en el afinador</Link>
      </p>

      <section className={styles.result} aria-live="polite">
        {found ? (
          <>
            <p className={styles.state}>{held ? "Último acorde" : "Sonando"}</p>
            <p className={styles.name}>{found.chord.name}</p>
            <p className={styles.symbol}>{found.chord.symbol}</p>
            <p className={styles.notes}>
              {`Notas: ${found.chord.pcs.map(pcName).join(" · ")} · bajo ${pcName(found.chord.bass)}`}
            </p>
          </>
        ) : (
          <p className={styles.empty}>
            {running
              ? "Rasguea un acorde y déjalo sonar."
              : "Activa el micrófono y rasguea un acorde."}
          </p>
        )}
      </section>

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

      {found && shape && (
        <section className={styles.shapes} aria-label="Cómo se toca">
          {ordered.length > 1 && (
            <div className={styles.choices}>
              {ordered.map((v, k) => (
                <Chip
                  key={v.frets.join()}
                  size="s"
                  label={`Forma ${k + 1}${v.lowest === found.lowest ? " · tu bajo" : ""}`}
                  selected={k === Math.min(choice, ordered.length - 1)}
                  onClick={() => setChoice(k)}
                />
              ))}
            </div>
          )}
          <div className={styles.shape}>
            <ChordDiagram
              frets={shape.frets}
              fingers={shape.fingers}
              barre={shape.barre}
              strings={names}
              label={`${found.chord.name}: ${fretWords(shape)}`}
            />
            <Tab frets={shape.frets} strings={names} label={found.chord.name} />
          </div>
          <p className={styles.hint}>
            El audio dice qué notas suenan, no en qué trastes: estas son formas para tocar este
            acorde en tu afinación. «Tu bajo» marca la que empieza en la nota grave que escuché.
          </p>
        </section>
      )}
      {found && !shape && (
        <p className={styles.hint}>
          No encontré una forma cómoda para este acorde en {tuning.label.toLowerCase()}.
        </p>
      )}
    </div>
  );
}
