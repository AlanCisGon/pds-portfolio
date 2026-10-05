import { ProjectCard } from "@/ui";
import { getProjects } from "@/utils/projects";
import styles from "./Projects.module.css";

interface ProjectsProps {
  /** 1-indexed range over the projects (featured first, then newest first). */
  range?: [number, number?];
  exclude?: string[];
  /** horizontal = featured card (Home desktop); always vertical on mobile. */
  layout?: "vertical" | "horizontal";
  /** Load the first cover with priority when the list is above the fold (LCP). */
  priorityFirst?: boolean;
}

export function Projects({
  range,
  exclude,
  layout = "vertical",
  priorityFirst = false,
}: ProjectsProps) {
  const excluded = new Set(exclude);
  const sorted = getProjects().filter((project) => !excluded.has(project.slug));

  const start = range ? Math.max(0, range[0] - 1) : 0;
  const end = range ? Math.min(sorted.length, range[1] ?? sorted.length) : sorted.length;
  const projects = sorted.slice(start, end);

  return (
    <ul className={styles.grid} data-layout={layout}>
      {projects.map((post, index) => {
        const year = post.metadata.publishedAt.slice(0, 4);
        const cover = post.metadata.images[0];
        return (
          <li key={post.slug}>
            <ProjectCard
              href={`/work/${post.slug}`}
              meta={[post.metadata.client, year].filter(Boolean).join(" · ")}
              title={post.metadata.title}
              summary={post.metadata.summary}
              tags={post.metadata.tags}
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
