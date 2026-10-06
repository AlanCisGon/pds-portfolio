import { ArrowRight } from "iconoir-react";

import { Projects } from "@/components/work/Projects";
import { about, home, person, work } from "@/resources";
import { Avatar, Button, FeaturedCase } from "@/ui";
import { getProject } from "@/utils/projects";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

export default function Home() {
  const featured = home.featured.display ? getProject(home.featured.slug) : undefined;
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
        <h1 className={styles.headline}>{home.headline}</h1>
        <p className={styles.subline}>{home.subline}</p>
        <Button
          href={about.path}
          variant="secondary"
          leadingIcon={
            about.avatar.display ? (
              <Avatar src={person.avatar} name={person.name} size="s" decorative />
            ) : undefined
          }
          trailingIcon={<ArrowRight />}
        >
          {about.title}
        </Button>
      </section>

      {featured && (
        <FeaturedCase
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
    </div>
  );
}
