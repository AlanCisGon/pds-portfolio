// Pitch detection for the tuner: YIN on a 2× decimated buffer (enough for 70–440 Hz, a guitar's open strings).

export type GuitarString = { ord: string; name: string; sci: string; freq: number };

/** Classical guitar, standard tuning, from the 6th string (low E) to the 1st. */
export const STRINGS: GuitarString[] = [
  { ord: "6ª", name: "Mi", sci: "E2", freq: 82.4069 },
  { ord: "5ª", name: "La", sci: "A2", freq: 110 },
  { ord: "4ª", name: "Re", sci: "D3", freq: 146.8324 },
  { ord: "3ª", name: "Sol", sci: "G3", freq: 195.9977 },
  { ord: "2ª", name: "Si", sci: "B3", freq: 246.9417 },
  { ord: "1ª", name: "Mi", sci: "E4", freq: 329.6276 },
];

export const centsOf = (freq: number, ref: number) => 1200 * Math.log2(freq / ref);

export function nearestString(freq: number) {
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  STRINGS.forEach((s, i) => {
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
