import { Meta, Schema } from "@once-ui-system/core";

import { Projects } from "@/components/work/Projects";
import { baseURL, about, person, work } from "@/resources";
import styles from "./page.module.css";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <div className={styles.page}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <h1 className={styles.title}>{work.label}</h1>
      <Projects priorityFirst />
    </div>
  );
}
