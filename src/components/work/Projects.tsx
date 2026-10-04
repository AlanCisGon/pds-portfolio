import { ProjectCard } from "@/ui";
import { getPosts } from "@/utils/utils";
import styles from "./Projects.module.css";

interface ProjectsProps {
  /** 1-indexed range over the projects sorted by date (newest first). */
  range?: [number, number?];
  exclude?: string[];
  /** horizontal = featured card (Home desktop); always vertical on mobile. */
  layout?: "vertical" | "horizontal";
  /** Load the first cover with priority when the list is above the fold (LCP). */
  priorityFirst?: boolean;
}

export function Projects({ range, exclude, layout = "vertical", priorityFirst = false }: ProjectsProps) {
  const excluded = new Set(exclude);
  const sorted = getPosts(["src", "app", "work", "projects"])
    .filter((post) => !excluded.has(post.slug))
    .sort(
      (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    );

  const start = range ? Math.max(0, range[0] - 1) : 0;
  const end = range ? Math.min(sorted.length, range[1] ?? sorted.length) : sorted.length;
  const projects = sorted.slice(start, end);

  return (
    <ul className={styles.grid} data-layout={layout}>
      {projects.map((post, index) => {
        const year = post.metadata.publishedAt ? new Date(post.metadata.publishedAt).getFullYear() : "";
        const cover = post.metadata.images[0];
        return (
          <li key={post.slug}>
            <ProjectCard
              href={`/work/${post.slug}`}
              meta={[post.metadata.client, year].filter(Boolean).join(" · ")}
              title={post.metadata.title}
              summary={post.metadata.summary}
              tags={post.metadata.tag}
              cover={cover ? { src: cover, alt: "" } : undefined}
              layout={layout}
              priority={priorityFirst && index === 0}
              cta="Read case study"
            />
          </li>
        );
      })}
    </ul>
  );
}
