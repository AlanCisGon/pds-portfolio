import { NavArrowDown } from "iconoir-react";
import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

export type AccordionProps = {
  /** Figma: `Title`. */
  title: string;
  children: ReactNode;
  /** Figma: `Expanded`. */
  defaultOpen?: boolean;
};

/** Optional detail (synthesis above, process below). Native <details>: keyboard and screen reader support without JS. */
export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details className={styles.accordion} open={defaultOpen}>
      <summary className={styles.trigger}>
        <span>{title}</span>
        <span className={styles.chevron} aria-hidden="true">
          <NavArrowDown />
        </span>
      </summary>
      <div className={styles.panel}>{children}</div>
    </details>
  );
}
