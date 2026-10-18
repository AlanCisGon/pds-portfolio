import { ArrowRight } from "iconoir-react";
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
  /** Article card (no image): title in Voice/Card. wide = alone in its row; grid = one of 2–3. */
  layout?: "wide" | "grid";
  /** Meta line under the body ("Sep 3, 2026 · 5 min read"). */
  meta?: string;
  /** Text CTA at the bottom ("Read the note"); the whole card stays one link. */
  cta?: string;
  className?: string;
};

/** Bento tile. Distinguished by tone (bg-surface on page), no border or shadow. */
export function Card({ eyebrow, title, children, href, layout, meta, cta, className }: CardProps) {
  const cls = className ? `${styles.card} ${className}` : styles.card;
  const content = (
    <>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <p className={styles.title}>{title}</p>
      {children && <div className={styles.body}>{children}</div>}
      {meta && <p className={styles.meta}>{meta}</p>}
      {cta && (
        <span className={styles.cta}>
          {cta}
          <ArrowRight aria-hidden="true" className={styles.ctaIcon} />
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <NextLink href={href} className={cls} data-kind="link" data-layout={layout}>
        {content}
      </NextLink>
    );
  }
  return (
    <div className={cls} data-kind="static" data-layout={layout}>
      {content}
    </div>
  );
}
