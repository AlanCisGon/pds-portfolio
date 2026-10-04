import type { MetadataRoute } from "next";

import { baseURL, routes } from "@/resources";
import { getProjects } from "@/utils/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date().toISOString().slice(0, 10);

  const pages = Object.entries(routes)
    .filter(([, enabled]) => enabled)
    .map(([route]) => ({ url: `${baseURL}${route === "/" ? "" : route}`, lastModified: today }));

  const projects = getProjects().map((project) => ({
    url: `${baseURL}/work/${project.slug}`,
    lastModified: project.metadata.publishedAt,
  }));

  return [...pages, ...projects];
}
