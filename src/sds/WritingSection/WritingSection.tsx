import { Card } from "../Card";
import { Link } from "../Link";
import styles from "./WritingSection.module.css";

export type WritingArticle = {
  href: string;
  eyebrow: string;
  title: string;
  dek: string;
  /** "Sep 3, 2026 · 5 min read". */
  meta: string;
};

export type WritingSectionProps = {
  title: string;
  subtitle: string;
  /** Newest first. Shows up to three. */
  articles: WritingArticle[];
  /** Card CTA ("Read the note"). */
  cta: string;
  /** "All writing": shown only from two articles, since with one it repeats the card. */
  all: { href: string; label: string };
  /** Index page: show every note and no "All writing" link. */
  showAll?: boolean;
  /** h2 on Home, h1 on the index. */
  headingLevel?: 1 | 2;
};

/** WritingSection · organism. 1 article = wide card; 2–3 = grid; more = the 3 newest + "All writing". */
export function WritingSection({
  title,
  subtitle,
  articles,
  cta,
  all,
  showAll = true,
  headingLevel = 2,
}: WritingSectionProps) {
  if (articles.length === 0) return null;
  const shown = showAll ? articles.slice(0, 3) : articles;
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const layout = shown.length === 1 ? "wide" : "grid";
  return (
    <section className={styles.section} aria-labelledby="writing-title">
      <div className={styles.head}>
        <Heading id="writing-title" className={styles.title}>
          {title}
        </Heading>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <ul className={styles.list} data-layout={layout}>
        {shown.map((article) => (
          <li key={article.href}>
            <Card
              href={article.href}
              eyebrow={article.eyebrow}
              title={article.title}
              layout={layout}
              meta={article.meta}
              cta={cta}
            >
              <p>{article.dek}</p>
            </Card>
          </li>
        ))}
      </ul>
      {showAll && articles.length > 1 && (
        <Link href={all.href} kind="standalone">
          {all.label}
        </Link>
      )}
    </section>
  );
}
