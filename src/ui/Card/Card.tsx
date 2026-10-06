import NextLink from "next/link";
import type { ReactNode } from "react";
import styles from "./Card.module.css";

export type CardProps = {
  /** Figma: `Eyebrow` — numbering/metadata in Chivo Mono. */
  eyebrow?: string;
  /** Figma: `Title`. */
  title: string;
  /** Figma: `Body`. */
  children?: ReactNode;
  /** Figma: `Kind=link` when set: the whole card is one link. */
  href?: string;
  className?: string;
};

/** Bento tile. Distinguished by tone (bg-surface on page), no border or shadow. */
export function Card({ eyebrow, title, children, href, className }: CardProps) {
  const cls = className ? `${styles.card} ${className}` : styles.card;
  const content = (
    <>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <p className={styles.title}>{title}</p>
      {children && <div className={styles.body}>{children}</div>}
    </>
  );
  if (href) {
    return (
      <NextLink href={href} className={cls} data-kind="link">
        {content}
      </NextLink>
    );
  }
  return (
    <div className={cls} data-kind="static">
      {content}
    </div>
  );
}
