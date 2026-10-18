import type { ReactNode } from "react";
import styles from "./PullQuote.module.css";

export type PullQuoteProps = {
  /** The quoted line, part of the text itself (no attribution). */
  children: ReactNode;
};

/** PullQuote · atom. A line lifted out of the prose for emphasis. Never decorative, never a testimonial. */
export function PullQuote({ children }: PullQuoteProps) {
  return <p className={styles.quote}>{children}</p>;
}
