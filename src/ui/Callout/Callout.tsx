import type { ReactNode } from "react";
import { type StatusTone, statusIcons } from "../Badge";
import styles from "./Callout.module.css";

export type CalloutProps = {
  /** Figma: `Tone`. */
  tone?: StatusTone;
  /** Figma: `Title` (omit = showTitle off). */
  title?: string;
  /** Figma: `Body`. */
  children: ReactNode;
};

/** Notice inside a case study (replaces Once UI Feedback). Icon + title: never color alone. */
export function Callout({ tone = "info", title, children }: CalloutProps) {
  return (
    <aside className={styles.callout} data-tone={tone} aria-label={title}>
      <span className={styles.icon} aria-hidden="true">
        {statusIcons[tone]}
      </span>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.body}>{children}</div>
      </div>
    </aside>
  );
}
