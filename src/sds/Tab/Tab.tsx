import styles from "./Tab.module.css";

export type TabProps = {
  /** Fret per string, 6th (lowest) to 1st; null = muted, 0 = open. */
  frets: (number | null)[];
  /** String names, 6th to 1st (e.g. the tuning). Shown left of each line. */
  strings: string[];
  /** Accessible name of the chord this tab plays. */
  label: string;
};

/** One chord as tablature: six lines, 1st string on top, the fret on each line. Display only. */
export function Tab({ frets, strings, label }: TabProps) {
  // Tab reads top-down from the highest string.
  const rows = frets
    .map((f, s) => ({ f, name: strings[s], ord: `${frets.length - s}ª` }))
    .reverse();
  const words = rows
    .map(({ f, ord }) => `${ord} ${f === null ? "apagada" : f === 0 ? "al aire" : `traste ${f}`}`)
    .join(", ");
  return (
    <div className={styles.tab} role="img" aria-label={`${label}. Tablatura: ${words}.`}>
      {rows.map(({ f, name, ord }) => (
        <div key={ord} className={styles.row} aria-hidden="true">
          <span className={styles.name}>{name}</span>
          <span className={styles.line}>
            <span className={styles.fret} data-muted={f === null || undefined}>
              {f === null ? "×" : f}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
