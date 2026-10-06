import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "src", "app", "work", "projects");

export type TeamMember = { name: string; role: string; avatar: string; linkedIn: string };

/** Front matter of a case study (src/app/work/projects/<slug>.mdx). */
export type ProjectMeta = {
  title: string;
  /** Client in the meta line ("Coppel · 2024"). */
  client: string;
  /** Internal project name, shown only in the meta line ("Coppel · Project Helix · 2025"). */
  codename: string;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  summary: string;
  /** Open Graph image; otherwise generated from the title. */
  image: string;
  /** The first one is the cover. */
  images: string[];
  /** Scope tags (Web, App, Team leadership…). */
  tags: string[];
  team: TeamMember[];
  /** Live product URL ("View project"). */
  link: string;
  /** FactSheet: when the project ran ("Q4 2024 – Sep 2025"). Empty = the pair is omitted. */
  dates: string;
  /** FactSheet: industry. Empty = the pair is omitted. */
  industry: string;
  /** FactSheet: line under the avatars in the Team pair ("3 UI · 2 UX · 1 UX writer"). */
  teamNote: string;
  /** Pinned before the rest: Home shows the first project as the featured card. */
  featured: boolean;
};

export type Project = { slug: string; metadata: ProjectMeta; content: string };

function readProject(file: string): Project {
  const { data, content } = matter(fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8"));
  return {
    slug: path.basename(file, ".mdx"),
    content,
    metadata: {
      title: data.title ?? "",
      client: data.client ?? "",
      codename: data.codename ?? "",
      publishedAt: data.publishedAt ?? "",
      summary: data.summary ?? "",
      image: data.image ?? "",
      images: data.images ?? [],
      tags: data.tags ?? [],
      team: data.team ?? [],
      link: data.link ?? "",
      dates: data.dates ?? "",
      industry: data.industry ?? "",
      teamNote: data.teamNote ?? "",
      featured: data.featured === true,
    },
  };
}

/** All case studies: featured first, then newest first. */
export function getProjects(): Project[] {
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readProject)
    .sort(
      (a, b) =>
        Number(b.metadata.featured) - Number(a.metadata.featured) ||
        b.metadata.publishedAt.localeCompare(a.metadata.publishedAt),
    );
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
