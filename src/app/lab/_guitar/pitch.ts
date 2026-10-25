// Pitch detection for the tuner: YIN on a 2× decimated buffer (enough for 70–440 Hz, a guitar's open
// strings in every tuning below: the lowest is D2, 73.4 Hz).

export type GuitarString = { ord: string; name: string; sci: string; freq: number; midi: number };

export type Tuning = {
  id: string;
  label: string;
  /** MIDI notes from the 6th string (lowest) to the 1st. */
  midi: number[];
  /** Name the notes with flats (Mi♭) instead of sharps (Re♯). */
  flats?: boolean;
};

/** Common guitar tunings. The first is the default. */
export const TUNINGS: Tuning[] = [
  { id: "estandar", label: "Estándar", midi: [40, 45, 50, 55, 59, 64] },
  { id: "drop-d", label: "Drop D", midi: [38, 45, 50, 55, 59, 64] },
  { id: "medio-tono", label: "Medio tono abajo", midi: [39, 44, 49, 54, 58, 63], flats: true },
  { id: "un-tono", label: "Un tono abajo", midi: [38, 43, 48, 53, 57, 62] },
  { id: "dadgad", label: "DADGAD", midi: [38, 45, 50, 55, 57, 62] },
  { id: "open-g", label: "Abierta de Sol", midi: [38, 43, 50, 55, 59, 62] },
  { id: "open-d", label: "Abierta de Re", midi: [38, 45, 50, 54, 57, 62] },
  { id: "open-e", label: "Abierta de Mi", midi: [40, 47, 52, 56, 59, 64] },
];

export const DEFAULT_A4 = 440;
export const A4_RANGE = [430, 450] as const;

const SHARP = ["Do", "Do♯", "Re", "Re♯", "Mi", "Fa", "Fa♯", "Sol", "Sol♯", "La", "La♯", "Si"];
const FLAT = ["Do", "Re♭", "Re", "Mi♭", "Mi", "Fa", "Sol♭", "Sol", "La♭", "La", "Si♭", "Si"];
const SCI_SHARP = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const SCI_FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

export const midiToFreq = (midi: number, a4 = DEFAULT_A4) => a4 * 2 ** ((midi - 69) / 12);

export function noteName(midi: number, flats = false) {
  return (flats ? FLAT : SHARP)[((midi % 12) + 12) % 12];
}

/** The six strings of a tuning, from the 6th to the 1st, at a given A4. */
export function stringsOf(tuning: Tuning, a4 = DEFAULT_A4): GuitarString[] {
  return tuning.midi.map((midi, i) => ({
    ord: `${6 - i}ª`,
    name: noteName(midi, tuning.flats),
    sci: `${(tuning.flats ? SCI_FLAT : SCI_SHARP)[midi % 12]}${Math.floor(midi / 12) - 1}`,
    freq: midiToFreq(midi, a4),
    midi,
  }));
}

/** Classical guitar, standard tuning, A4 = 440. */
export const STRINGS: GuitarString[] = stringsOf(TUNINGS[0]);

export const centsOf = (freq: number, ref: number) => 1200 * Math.log2(freq / ref);

export function nearestString(freq: number, strings: GuitarString[] = STRINGS) {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  strings.forEach((s, i) => {
    const d = Math.abs(centsOf(freq, s.freq));
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

export const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[sorted.length >> 1];
};

function yin(x: Float32Array, sampleRate: number, d: Float32Array) {
  const minTau = Math.max(2, Math.floor(sampleRate / 440));
  const maxTau = Math.floor(sampleRate / 70);
  const width = x.length - maxTau;
  if (width < maxTau || d.length < maxTau + 2) return null;

  // Difference function, then its cumulative mean normalization.
  for (let tau = 1; tau <= maxTau + 1; tau++) {
    let sum = 0;
    for (let i = 0; i < width; i++) {
      const v = x[i] - x[i + tau];
      sum += v * v;
    }
    d[tau] = sum;
  }
  d[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= maxTau + 1; tau++) {
    running += d[tau];
    d[tau] = running > 0 ? (d[tau] * tau) / running : 1;
  }

  // First dip under the threshold, walked down to its local minimum; else the global minimum if it is clear.
  let tau = -1;
  for (let t = minTau; t <= maxTau; t++) {
    if (d[t] < 0.12) {
      while (t + 1 <= maxTau && d[t + 1] < d[t]) t++;
      tau = t;
      break;
    }
  }
  if (tau < 0) {
    let min = 1;
    for (let t = minTau; t <= maxTau; t++) {
      if (d[t] < min) {
        min = d[t];
        tau = t;
      }
    }
    if (min >= 0.25) return null;
  }

  const a = d[tau - 1];
  const b = d[tau];
  const c = d[tau + 1];
  const den = a - 2 * b + c;
  const shift = den ? (0.5 * (a - c)) / den : 0;
  return { freq: sampleRate / (tau + Math.max(-1, Math.min(1, shift))), confidence: 1 - b };
}

// Below this level a fading string reads up to 25 cents off, so it is not measured (the tuner
// holds the last clear reading instead). Above room noise × NOISE_GATE, whichever is higher.
const MIN_RMS = 0.004;
const NOISE_GATE = 4;

/** Creates a detector with its buffers allocated once. Returns Hz, or null for silence or noise. */
export function createDetector(size: number, sampleRate: number) {
  const decimated = new Float32Array(size / 2);
  const work = new Float32Array(Math.floor(sampleRate / 2 / 70) + 2);
  // Room noise, learned on the fly: drops at once to a quieter frame, creeps up slowly otherwise.
  let floor = 0;
  return (buf: Float32Array) => {
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    floor = floor === 0 || rms < floor ? rms : floor * 1.003;
    if (rms < Math.max(MIN_RMS, floor * NOISE_GATE)) return null;
    for (let i = 0; i < decimated.length; i++) decimated[i] = (buf[2 * i] + buf[2 * i + 1]) * 0.5;
    const r = yin(decimated, sampleRate / 2, work);
    return r && r.confidence > 0.8 ? r.freq : null;
  };
}
