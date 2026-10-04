import { ArrowRight } from "iconoir-react";

import { Projects } from "@/components/work/Projects";
import { about, home, person } from "@/resources";
import { Avatar, Button, Link } from "@/ui";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: home.title,
  description: home.description,
  path: home.path,
  image: home.image,
});

export default function Home() {
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
        {home.featured.display && (
          <p className={styles.featured}>
            <span className={styles.featuredLabel}>{home.featured.label}</span>
            <Link href={home.featured.href} kind="standalone">
              {home.featured.title}
            </Link>
          </p>
        )}
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

      <Projects range={[1, 1]} layout="horizontal" priorityFirst />
      <Projects range={[2]} />
    </div>
  );
}
