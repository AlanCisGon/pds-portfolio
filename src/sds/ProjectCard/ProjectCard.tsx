import { ArrowRight, MediaImage } from "iconoir-react";
import Image from "next/image";
import NextLink from "next/link";
import { Tag } from "../Tag";
import styles from "./ProjectCard.module.css";

export type ProjectCardProps = {
  href: string;
  /** Industry · client · year, in Chivo Mono. */
  meta: string;
  title: string;
  summary?: string;
  /** Informative tags (no icons). */
  tags?: string[];
  cover?: { src: string; alt: string };
  /** Figma: `Layout`. horizontal = featured on Home desktop; always vertical on mobile. */
  layout?: "vertical" | "horizontal";
  /** First card on the page: load its cover first (LCP). */
  priority?: boolean;
  /** Text of the link affordance. */
  cta?: string;
};

/** Case-study card. The whole card is ONE link (no nested links); the CTA is its visual affordance. */
export function ProjectCard({
  href,
  meta,
  title,
  summary,
  tags = [],
  cover,
  layout = "vertical",
  priority = false,
  cta = "Read case study",
}: ProjectCardProps) {
  return (
    <NextLink href={href} className={styles.card} data-layout={layout}>
      <span className={styles.cover}>
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 768px) 400px, 100vw"
            preload={priority}
            fetchPriority={priority ? "high" : undefined}
            className={styles.image}
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true">
            <MediaImage />
          </span>
        )}
      </span>
      <span className={styles.body}>
        <span className={styles.meta}>{meta}</span>
        <span className={styles.title}>{title}</span>
        {summary && <span className={styles.summary}>{summary}</span>}
        {tags.length > 0 && (
          <span className={styles.tags}>
            {tags.map((t) => (
              <Tag key={t} size="small">
                {t}
              </Tag>
            ))}
          </span>
        )}
        <span className={styles.cta}>
          {cta}
          <span className={styles.ctaIcon} aria-hidden="true">
            <ArrowRight />
          </span>
        </span>
      </span>
    </NextLink>
  );
}
