import { HeroVisual } from "@/components/hero/HeroVisual";
import { Projects } from "@/components/work/Projects";
import { blog, home, work } from "@/resources";
import { FeaturedCase, LaunchStrip, WritingSection } from "@/sds";
import { writingArticles } from "@/utils/blog";
import { getProject } from "@/utils/projects";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import { NavArrowDown } from "iconoir-react";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

export default function Home() {
  const featured = home.featured.display ? getProject(home.featured.slug) : undefined;
  const articles = writingArticles();
  // Launch strip: only while there is exactly one note (Alan: until the second one ships).
  const launch = articles.length === 1 ? articles[0] : undefined;
  return (
    <div className={styles.page}>
      <JsonLd
        data={pageSchema({
          type: "WebPage",
          title: home.title,
          description: home.description,
          path: home.path,
        })}
      />

      {/* Content first: no reveal animation, so the hero is the first paint. */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.headline}>{home.headline}</h1>
          <p className={styles.subline}>{home.subline}</p>
        </div>
        <HeroVisual className={styles.visual} />
        <a className={styles.cue} href={`#${home.scrollCue.target}`}>
          <span>{home.scrollCue.label}</span>
          <NavArrowDown aria-hidden="true" className={styles.cueIcon} />
        </a>
      </section>

      <span id={home.scrollCue.target} className={styles.anchor} aria-hidden="true" />

      {launch && <LaunchStrip href={launch.href} lead={blog.launch.lead} title={launch.title} />}

      {featured && (
        <FeaturedCase
          divider={!launch}
          href={`${work.path}/${featured.slug}`}
          meta={home.featured.meta}
          badge={home.featured.badge}
          proof={home.featured.proof}
          title={home.featured.title}
          role={home.featured.role}
          team={featured.metadata.team
            .filter((member) => member.avatar)
            .map((member) => ({ name: member.name, src: member.avatar }))}
          cta={home.featured.cta}
          cover={home.featured.cover}
          priority
        />
      )}
      <Projects exclude={featured ? [featured.slug] : undefined} />
      <WritingSection
        title={blog.section.title}
        subtitle={blog.section.subtitle}
        articles={articles}
        cta={blog.section.cardCta}
        all={{ href: blog.path, label: blog.all }}
      />
    </div>
  );
}
