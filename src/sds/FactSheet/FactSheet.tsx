import type { ReactNode } from "react";
import styles from "./FactSheet.module.css";

export type FactSheetItem = {
  label: string;
  /** Empty values are dropped: a missing fact is omitted, never filled in. */
  value?: ReactNode;
  /** Spans two columns (e.g. Team with an AvatarGroup). */
  wide?: boolean;
};

export type FactSheetProps = { items: FactSheetItem[] };

/**
 * Case fact sheet (Figma 02b, 177:128): up to 5 label/value pairs above the cover, as a <dl>.
 * No rule or surface: structure shows through alignment. 2 columns, 4 from 768.
 * ≠ Stat (evidence with a source) ≠ Table.
 */
export function FactSheet({ items }: FactSheetProps) {
  const shown = items.filter(
    (item) => item.value !== undefined && item.value !== null && item.value !== "",
  );
  if (shown.length === 0) return null;
  return (
    <dl className={styles.sheet}>
      {shown.map((item) => (
        <div key={item.label} className={styles.item} data-wide={item.wide || undefined}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
