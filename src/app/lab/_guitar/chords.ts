// Chord finder: which notes sound (several at once), which chord they make, and how to play it.
//
// 1. Peaks of the magnitude spectrum (an AnalyserNode with a long FFT).
// 2. Notes by harmonic summation: the note whose harmonics explain the most energy wins, its
//    harmonics are taken out, and the search repeats (multi-pitch estimation, Klapuri-style).
// 3. Chord: the template (mayor, menor, 7…) in the 12 roots that best covers those notes.
// 4. Voicings: fret combinations for the current tuning that sound exactly those notes.

export type Note = { midi: number; salience: number };

export type ChordType = {
  id: string;
  /** Symbol suffix: "" (C), "m" (Cm), "7" (C7)… */
  symbol: string;
  /** Spanish name: "mayor", "menor"… */
  name: string;
  intervals: number[];
};

export const CHORD_TYPES: ChordType[] = [
  { id: "maj", symbol: "", name: "mayor", intervals: [0, 4, 7] },
  { id: "min", symbol: "m", name: "menor", intervals: [0, 3, 7] },
  { id: "7", symbol: "7", name: "séptima", intervals: [0, 4, 7, 10] },
  { id: "maj7", symbol: "maj7", name: "séptima mayor", intervals: [0, 4, 7, 11] },
  { id: "m7", symbol: "m7", name: "menor séptima", intervals: [0, 3, 7, 10] },
  { id: "sus2", symbol: "sus2", name: "suspendido de segunda", intervals: [0, 2, 7] },
  { id: "sus4", symbol: "sus4", name: "suspendido de cuarta", intervals: [0, 5, 7] },
  { id: "dim", symbol: "dim", name: "disminuido", intervals: [0, 3, 6] },
  { id: "aug", symbol: "aug", name: "aumentado", intervals: [0, 4, 8] },
  { id: "5", symbol: "5", name: "quinta", intervals: [0, 7] },
];

const LETTER = ["C", "C♯", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const SOLFA = ["Do", "Do♯", "Re", "Mi♭", "Mi", "Fa", "Fa♯", "Sol", "La♭", "La", "Si♭", "Si"];
export const pcName = (pc: number) => SOLFA[((pc % 12) + 12) % 12];
export const pcLetter = (pc: number) => LETTER[((pc % 12) + 12) % 12];
const pcOf = (midi: number) => ((midi % 12) + 12) % 12;

export type Chord = {
  root: number;
  type: ChordType;
  /** Pitch class of the lowest note; differs from root in an inversion. */
  bass: number;
  /** Pitch classes of the chord, root first. */
  pcs: number[];
  /** "Do mayor", "Re menor / Fa♯"… */
  name: string;
  /** "C", "Dm/F♯"… */
  symbol: string;
};

// ── 1 · Peaks ────────────────────────────────────────────────────────────────

type Peak = { freq: number; amp: number };

const LOW_HZ = 65;
const HIGH_HZ = 2600;

/** Local maxima of a linear magnitude spectrum, refined with a parabola on the log scale. */
function peaks(mag: Float32Array, binHz: number): Peak[] {
  const lo = Math.max(2, Math.floor(LOW_HZ / binHz));
  const hi = Math.min(mag.length - 2, Math.ceil(HIGH_HZ / binHz));
  let max = 0;
  for (let i = lo; i <= hi; i++) if (mag[i] > max) max = mag[i];
  if (max === 0) return [];
  // Noise is flat; a plucked note stands well above the typical bin (here, 30 dB over the median).
  const sorted = Array.from(mag.subarray(lo, hi + 1)).sort((a, b) => a - b);
  const typical = sorted[sorted.length >> 1];
  if (max < typical * 30) return [];
  const floor = Math.max(max * 0.01, typical * 6);
  const out: Peak[] = [];
  for (let i = lo; i <= hi; i++) {
    const m = mag[i];
    if (m < floor || m < mag[i - 1] || m <= mag[i + 1]) continue;
    const a = Math.log(mag[i - 1] + 1e-12);
    const b = Math.log(m + 1e-12);
    const c = Math.log(mag[i + 1] + 1e-12);
    const den = a - 2 * b + c;
    const shift = den ? Math.max(-0.5, Math.min(0.5, (0.5 * (a - c)) / den)) : 0;
    out.push({ freq: (i + shift) * binHz, amp: m / max });
  }
  return out;
}

// ── 2 · Notes ────────────────────────────────────────────────────────────────

const MIN_MIDI = 38; // D2: the lowest open string in any tuning offered
const MAX_MIDI = 79; // G5: a high fret on the 1st string
const HARMONICS = 8;
const TOLERANCE = 0.03; // ≈ 50 cents to match a harmonic

const midiFreq = (midi: number, a4: number) => a4 * 2 ** ((midi - 69) / 12);

function nearestPeak(list: Peak[], freq: number) {
  let best = -1;
  let dist = TOLERANCE;
  for (let i = 0; i < list.length; i++) {
    const d = Math.abs(list[i].freq / freq - 1);
    if (d < dist) {
      dist = d;
      best = i;
    }
  }
  return best;
}

function salience(list: Peak[], amps: number[], midi: number, a4: number) {
  const f0 = midiFreq(midi, a4);
  const first = nearestPeak(list, f0);
  // A note needs its own fundamental: otherwise f/2 would claim every chord tone an octave up.
  if (first < 0 || amps[first] < 0.02) return 0;
  let sum = 0;
  for (let h = 1; h <= HARMONICS; h++) {
    const k = h === 1 ? first : nearestPeak(list, f0 * h);
    if (k >= 0) sum += Math.sqrt(amps[k]) / h ** 0.5;
  }
  return sum;
}

/** The notes sounding in a spectrum, strongest first. `mag` is linear magnitude per bin. */
export function notesIn(mag: Float32Array, sampleRate: number, fftSize: number, a4 = 440): Note[] {
  const list = peaks(mag, sampleRate / fftSize);
  if (list.length === 0) return [];
  const amps = list.map((p) => p.amp);
  const found: Note[] = [];
  let firstSalience = 0;
  for (let round = 0; round < 6; round++) {
    let best = -1;
    let bestS = 0;
    for (let m = MIN_MIDI; m <= MAX_MIDI; m++) {
      if (found.some((n) => n.midi === m)) continue;
      const s = salience(list, amps, m, a4);
      if (s > bestS) {
        bestS = s;
        best = m;
      }
    }
    if (best < 0 || bestS < firstSalience * 0.25) break;
    if (round === 0) firstSalience = bestS;
    found.push({ midi: best, salience: bestS });
    // Take its harmonics out; a shared harmonic keeps a little for the other note.
    const f0 = midiFreq(best, a4);
    for (let h = 1; h <= HARMONICS; h++) {
      const k = nearestPeak(list, f0 * h);
      if (k >= 0) amps[k] *= 0.15;
    }
  }
  return found;
}

// ── 3 · Chord ────────────────────────────────────────────────────────────────

function chordName(root: number, type: ChordType, bass: number) {
  const slash = bass !== root;
  return {
    name: `${pcName(root)} ${type.name}${slash ? ` / ${pcName(bass)}` : ""}`,
    symbol: `${pcLetter(root)}${type.symbol}${slash ? `/${pcLetter(bass)}` : ""}`,
  };
}

/** The chord those notes make, or null if they do not make a clear one. */
export function chordOf(notes: Note[]): Chord | null {
  if (notes.length < 2) return null;
  const weight = new Array(12).fill(0);
  for (const n of notes) weight[pcOf(n.midi)] += n.salience;
  const max = Math.max(...weight);
  for (let i = 0; i < 12; i++) weight[i] /= max;
  const present = weight.filter((w) => w > 0.15).length;
  if (present < 2) return null;
  // Bass: the lowest note that is not a stray.
  const strong = notes.filter((n) => n.salience >= notes[0].salience * 0.3);
  const bass = pcOf(Math.min(...strong.map((n) => n.midi)));

  let best: { score: number; root: number; type: ChordType } | null = null;
  for (let root = 0; root < 12; root++) {
    for (const [order, type] of CHORD_TYPES.entries()) {
      const tones = type.intervals.map((iv) => (root + iv) % 12);
      let score = 0;
      for (let pc = 0; pc < 12; pc++) score += tones.includes(pc) ? weight[pc] : -1.2 * weight[pc];
      const missing = tones.filter((pc) => weight[pc] < 0.1).length;
      score -= 0.6 * missing;
      if (root === bass) score += 0.15; // root position is the common reading
      score -= order * 0.01; // on a tie, the simpler chord
      if (!best || score > best.score) best = { score, root, type };
    }
  }
  if (!best || best.score < 0.8) return null;
  const pcs = best.type.intervals.map((iv) => (best.root + iv) % 12);
  if (!pcs.includes(bass)) return null;
  return { root: best.root, type: best.type, bass, pcs, ...chordName(best.root, best.type, bass) };
}

// ── 4 · Voicings ─────────────────────────────────────────────────────────────

export type Voicing = {
  /** Fret per string, 6th to 1st; null = muted, 0 = open. */
  frets: (number | null)[];
  /** Finger per string (1 index … 4 pinky); null when open or muted. */
  fingers: (number | null)[];
  /** A barre with finger 1, from the string index `from` to the 1st string. */
  barre: { fret: number; from: number } | null;
  /** MIDI of the lowest sounding note. */
  lowest: number;
};

const MAX_FRET = 12;
const SPAN = 3; // frets between index and pinky

/** Playable ways to sound `chord` in `tuning` (MIDI of the open strings, 6th to 1st), easiest first. */
export function voicings(chord: Chord, tuning: number[], limit = 3): Voicing[] {
  const tones = new Set(chord.pcs);
  // With four tones, the fifth may go (guitarists drop it all the time).
  const fifth = chord.pcs.length >= 4 ? (chord.root + 7) % 12 : -1;
  const minSounding = chord.pcs.length <= 2 ? 3 : 4;
  const found = new Map<string, { v: Voicing; score: number }>();

  for (let start = 1; start <= MAX_FRET - SPAN; start++) {
    const options = tuning.map((open) => {
      const o: (number | null)[] = [null];
      if (tones.has(pcOf(open))) o.push(0);
      for (let f = start; f <= start + SPAN; f++) if (tones.has(pcOf(open + f))) o.push(f);
      return o;
    });
    const pick: (number | null)[] = [];
    const walk = (s: number) => {
      if (s === tuning.length) {
        const v = judge(pick, tuning, chord, tones, fifth, minSounding);
        if (v) {
          const key = v.v.frets.join(",");
          const prev = found.get(key);
          if (!prev || v.score < prev.score) found.set(key, v);
        }
        return;
      }
      for (const f of options[s]) {
        // Mutes only below the first sounding string: no muted string in the middle or on top.
        if (f === null && pick.some((p) => p !== null)) continue;
        pick[s] = f;
        walk(s + 1);
      }
    };
    walk(0);
  }
  return [...found.values()]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.v);
}

function judge(
  frets: (number | null)[],
  tuning: number[],
  chord: Chord,
  tones: Set<number>,
  fifth: number,
  minSounding: number,
): { v: Voicing; score: number } | null {
  const sounding = frets.map((f, s) => (f === null ? null : tuning[s] + f));
  const notes = sounding.filter((n): n is number => n !== null);
  if (notes.length < minSounding) return null;
  if (pcOf(notes[0]) !== chord.bass) return null;
  const covered = new Set(notes.map(pcOf));
  for (const pc of tones) if (!covered.has(pc) && pc !== fifth) return null;

  const fretted = frets.filter((f): f is number => f !== null && f > 0);
  const lo = fretted.length ? Math.min(...fretted) : 0;
  const hi = fretted.length ? Math.max(...fretted) : 0;
  if (hi - lo > SPAN) return null;

  // Barre: finger 1 flat across the lowest fret, from its first string to the 1st, nothing open
  // under it. Only when it is needed: three or more strings on that fret, or more than four fingers.
  let barre: Voicing["barre"] = null;
  const atLo = frets.flatMap((f, s) => (f === lo && lo > 0 ? [s] : []));
  if (
    atLo.length >= 2 &&
    (atLo.length >= 3 || fretted.length > 4) &&
    frets.slice(atLo[0]).every((f) => f !== null && f >= lo)
  ) {
    barre = { fret: lo, from: atLo[0] };
  }
  const fingerSpots = frets
    .map((f, s) => ({ f, s }))
    .filter(({ f }) => f !== null && f > 0 && !(barre && f === barre.fret));
  const fingerCount = fingerSpots.length + (barre ? 1 : 0);
  if (fingerCount > 4) return null;

  // Fingers: barre (or lowest fret) is 1, then by fret and string order.
  const fingers: (number | null)[] = frets.map(() => null);
  let next = 1;
  if (barre) {
    for (let s = barre.from; s < frets.length; s++) if (frets[s] === barre.fret) fingers[s] = 1;
    next = 2;
  }
  const order = [...fingerSpots].sort((a, b) => (a.f as number) - (b.f as number) || a.s - b.s);
  for (const { s } of order) fingers[s] = next++;

  const opens = frets.filter((f) => f === 0).length;
  const muted = frets.filter((f) => f === null).length;
  // Open strings help in first position; up the neck they make odd, hard-to-damp shapes.
  const openCost = lo >= 3 ? 1.5 : hi >= 4 ? 1.2 : -0.4;
  const score =
    lo * 1.2 +
    (hi - lo) * 0.8 +
    fingerCount * 0.6 +
    muted * 0.7 +
    opens * openCost +
    (barre ? 1.5 : 0);
  return { v: { frets: [...frets], fingers, barre, lowest: notes[0] }, score };
}
