import { ArrowRight } from "iconoir-react";

import { Meta, Schema } from "@once-ui-system/core";

import { Projects } from "@/components/work/Projects";
import { home, about, person, baseURL } from "@/resources";
import { Avatar, Button, Link } from "@/ui";
import styles from "./page.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <div className={styles.page}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
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
          leadingIcon={about.avatar.display ? <Avatar src={person.avatar} name={person.name} size="s" decorative /> : undefined}
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
