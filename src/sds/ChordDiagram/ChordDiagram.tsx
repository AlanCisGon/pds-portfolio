import styles from "./ChordDiagram.module.css";

export type ChordDiagramProps = {
  /** Fret per string, 6th (lowest) to 1st; null = muted, 0 = open. */
  frets: (number | null)[];
  /** Finger per string (1 index … 4 pinky); null when open or muted. */
  fingers?: (number | null)[];
  /** Figma: `Barre`. Finger 1 flat on `fret`, from string index `from` to the 1st string. */
  barre?: { fret: number; from: number } | null;
  /** Open-string names under the grid, 6th to 1st (e.g. the tuning). */
  strings?: string[];
  /** Accessible name: the chord and its frets in words. */
  label: string;
};

// Geometry in SVG units. Strings are vertical, the nut on top, as guitarists read a chord box.
const GAP_X = 28;
const GAP_Y = 30;
const LEFT = 28;
const TOP = 30;
const FRETS = 4;
const FRET_LINES = [0, 1, 2, 3, 4];

/** Chord box: where each finger goes for one chord. Display only. */
export function ChordDiagram({ frets, fingers, barre, strings, label }: ChordDiagramProps) {
  const n = frets.length;
  const fretted = frets.filter((f): f is number => f !== null && f > 0);
  const maxFret = fretted.length ? Math.max(...fretted) : 0;
  // First position shows the nut; up the neck, the window starts at the lowest fret.
  const base = maxFret <= FRETS ? 1 : Math.min(...fretted);
  const width = LEFT + GAP_X * (n - 1) + 16;
  const height = TOP + GAP_Y * FRETS + (strings ? 28 : 8);
  const x = (s: number) => LEFT + s * GAP_X;
  // One entry per string, keyed by its ordinal (6ª … 1ª): strings never reorder.
  const cols = frets.map((f, s) => ({ f, s, id: `${n - s}`, name: strings?.[s] }));
  const y = (fret: number) => TOP + (fret - base + 0.5) * GAP_Y;

  return (
    <figure className={styles.diagram} role="img" aria-label={label}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.svg} aria-hidden="true">
        {/* Muted and open marks above the nut. */}
        {cols.map(({ f, s, id }) =>
          f === null ? (
            <g key={`m${id}`} className={styles.mark}>
              <line x1={x(s) - 5} y1={TOP - 19} x2={x(s) + 5} y2={TOP - 9} strokeWidth={1.5} />
              <line x1={x(s) + 5} y1={TOP - 19} x2={x(s) - 5} y2={TOP - 9} strokeWidth={1.5} />
            </g>
          ) : f === 0 ? (
            <circle
              key={`o${id}`}
              className={styles.mark}
              cx={x(s)}
              cy={TOP - 14}
              r={5}
              fill="none"
              strokeWidth={1.5}
            />
          ) : null,
        )}
        {/* Grid. */}
        {FRET_LINES.map((k) => (
          <line
            key={`f${k}`}
            className={k === 0 && base === 1 ? styles.nut : styles.fret}
            x1={x(0)}
            x2={x(n - 1)}
            y1={TOP + k * GAP_Y}
            y2={TOP + k * GAP_Y}
            strokeWidth={k === 0 && base === 1 ? 4 : 1}
          />
        ))}
        {cols.map(({ s, id }) => (
          <line
            key={`s${id}`}
            className={styles.string}
            x1={x(s)}
            x2={x(s)}
            y1={TOP}
            y2={TOP + FRETS * GAP_Y}
            strokeWidth={1}
          />
        ))}
        {base > 1 && (
          <text className={styles.base} x={LEFT - 12} y={y(base) + 4} textAnchor="end">
            {base}
          </text>
        )}
        {barre && (
          <rect
            className={styles.dot}
            x={x(barre.from) - 9}
            y={y(barre.fret) - 9}
            width={x(n - 1) - x(barre.from) + 18}
            height={18}
            rx={9}
          />
        )}
        {cols.map(({ f, s, id }) => {
          if (f === null || f === 0) return null;
          const onBarre = barre && f === barre.fret && s >= barre.from;
          return (
            <g key={`d${id}`}>
              {!onBarre && <circle className={styles.dot} cx={x(s)} cy={y(f)} r={9} />}
              {fingers?.[s] && (!onBarre || s === barre?.from) && (
                <text className={styles.finger} x={x(s)} y={y(f) + 4} textAnchor="middle">
                  {fingers[s]}
                </text>
              )}
            </g>
          );
        })}
        {cols.map(({ s, id, name }) =>
          name === undefined ? null : (
            <text
              key={`n${id}`}
              className={styles.name}
              x={x(s)}
              y={TOP + FRETS * GAP_Y + 20}
              textAnchor="middle"
            >
              {name}
            </text>
          ),
        )}
      </svg>
    </figure>
  );
}
