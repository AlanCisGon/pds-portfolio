import type { ReactNode } from "react";
import styles from "./VisuallyHidden.module.css";

/** Text for assistive technology only (e.g. "abre en otra pestaña"). */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className={styles.hidden}>{children}</span>;
}
