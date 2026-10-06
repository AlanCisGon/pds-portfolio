import type { ReactNode } from "react";
import { Badge } from "../Badge";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./Stat.module.css";

export type StatUnit = "pp" | "pts" | "%";

export type StatProps = {
  /** Increment with its sign: "+2", "−60" (U+2212). Only increments, never absolute values. */
  value?: string;
  /** pp for rates, pts for scores, % for relative change. */
  unit: StatUnit;
  /** What was measured. */
  label: string;
  /** When it was measured ("Jan 2026"). */
  period?: string;
  /** Who measured it ("Digital analytics"). */
  source?: string;
  /** Full reading for screen readers ("+2 percentage points"). The visual figure is hidden from them when set. */
  accessibleValue?: string;
  /** Badge text when value, period or source is missing (copy from content, not from the component). */
  pendingLabel: ReactNode;
};

/**
 * The top rule is decorative (border-top, Figma Divider 29:4), so screen readers don't announce a separator per Stat.
 * Evidence: increment + unit + what was measured + period · source (Figma 02b, 177:92).
 * Honesty lives in the API: without value, period or source it shows the pending Badge instead of a number.
 * ≠ FactSheet (case data) ≠ Table (many rows). Not interactive.
 */
export function Stat({
  value,
  unit,
  label,
  period,
  source,
  accessibleValue,
  pendingLabel,
}: StatProps) {
  const complete = Boolean(value && period && source);
  return (
    <div className={styles.stat} data-evidence={complete ? "complete" : "pending"}>
      <div className={styles.body}>
        {complete ? (
          <>
            <p className={styles.valueRow}>
              <span className={styles.value} aria-hidden={accessibleValue ? true : undefined}>
                {value}
              </span>
              <span className={styles.unit} aria-hidden={accessibleValue ? true : undefined}>
                {unit}
              </span>
              {accessibleValue && <VisuallyHidden>{accessibleValue}</VisuallyHidden>}
            </p>
            <p className={styles.label}>{label}</p>
            <p className={styles.meta}>
              {period} <span aria-hidden="true">·</span> {source}
            </p>
          </>
        ) : (
          <>
            <Badge tone="neutral">{pendingLabel}</Badge>
            <p className={styles.label}>{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

/** Grid of Stats: 2 columns at every width, gap --bento-gap. Render nothing when there are no stats. */
export function StatGrid({ children }: { children: ReactNode }) {
  return <div className={styles.grid}>{children}</div>;
}
