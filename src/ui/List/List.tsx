import type { ReactNode } from "react";
import styles from "./List.module.css";

/** MDX lists. unordered uses an em dash marker (sober workshop mark), ordered uses numbers. */
export function List({ ordered = false, children }: { ordered?: boolean; children: ReactNode }) {
  const Tag = ordered ? "ol" : "ul";
  return <Tag className={styles.list}>{children}</Tag>;
}

/** Figma: ListItem. */
export function ListItem({ children }: { children: ReactNode }) {
  return <li className={styles.item}>{children}</li>;
}
