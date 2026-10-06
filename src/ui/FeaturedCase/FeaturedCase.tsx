import { useId } from "react";
import { AvatarGroup } from "../AvatarGroup";
import { Badge } from "../Badge";
import { Divider } from "../Divider";
import { Link } from "../Link";
import { Media } from "../Media";
import { VisuallyHidden } from "../VisuallyHidden";
import styles from "./FeaturedCase.module.css";

export type FeaturedCaseProps = {
  href: string;
  /** Meta line, e.g. "Case study · Somara Studio". */
  meta: string;
  /** Static status label (Badge, neutral). */
  badge?: string;
  /** The evidence: leads the block, in Voice. */
  proof: string;
  title: string;
  role: string;
  team?: Array<{ name: string; src?: string }>;
  cta: string;
  cover?: { src: string; alt: string };
  /** Load the cover with priority when the block is above the fold (LCP). */
  priority?: boolean;
};

/**
 * Editorial featured case (Figma 05 Explorations, A2 · 105-260 / 105-341).
 * Reading order: meta → proof → title → role → CTA; the image supports.
 * Only the CTA is a link, stretched over the block so the whole piece is clickable.
 */
export function FeaturedCase({
  href,
  meta,
  badge,
  proof,
  title,
  role,
  team,
  cta,
  cover,
  priority = false,
}: FeaturedCaseProps) {
  const titleId = useId();
  return (
    <section className={styles.featured} aria-labelledby={titleId}>
      <Divider />
      <div className={styles.row}>
        <div className={styles.column}>
          <div className={styles.group}>
            <div className={styles.metaRow}>
              {badge && (
                <Badge tone="neutral" showIcon={false}>
                  {badge}
                </Badge>
              )}
              <p className={styles.meta}>{meta}</p>
            </div>
            <p className={styles.proof}>{proof}</p>
          </div>
          <div className={styles.group}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            <div className={styles.role}>
              {team && team.length > 0 && <AvatarGroup people={team} />}
              <p className={styles.roleText}>{role}</p>
            </div>
          </div>
          <Link href={href} kind="standalone" className={styles.cta}>
            {cta}
            <VisuallyHidden>: {title}</VisuallyHidden>
          </Link>
        </div>
        {cover && (
          <div className={styles.cover}>
            <Media
              src={cover.src}
              alt={cover.alt}
              ratio="4:3"
              priority={priority}
              sizes="(min-width: 1024px) 400px, 100vw"
            />
          </div>
        )}
      </div>
    </section>
  );
}
