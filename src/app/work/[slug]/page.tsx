import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomMDX } from "@/components";
import { getHeadings } from "@/components/mdx";
import { Projects } from "@/components/work/Projects";
import { work } from "@/resources";
import { AvatarGroup, Link, Media, TableOfContents, Tag } from "@/ui";
import { formatDate } from "@/utils/format";
import { getProject, getProjects } from "@/utils/projects";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import styles from "./page.module.css";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getProjects().map((project) => ({ slug: project.slug }));
}

async function findPost(params: Promise<{ slug: string | string[] }>) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug || "";
  return getProject(slugPath);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const post = await findPost(params);
  if (!post) return {};

  return pageMetadata({
    title: post.metadata.title,
    description: post.metadata.summary,
    path: `${work.path}/${post.slug}`,
    image: post.metadata.image || undefined,
    type: "article",
    publishedTime: post.metadata.publishedAt,
  });
}

export default async function Project({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const post = await findPost(params);
  if (!post) notFound();

  const { metadata } = post;
  const team = metadata.team ?? [];
  const tags = metadata.tags;
  const cover = metadata.images[0];
  const headings = getHeadings(post.content);

  return (
    <div className={styles.page}>
      <JsonLd
        data={pageSchema({
          type: "BlogPosting",
          title: metadata.title,
          description: metadata.summary,
          path: `${work.path}/${post.slug}`,
          image: metadata.image || undefined,
          datePublished: metadata.publishedAt,
        })}
      />

      <header className={styles.header}>
        <Link href={work.path} kind="standalone">
          All projects
        </Link>
        <p className={styles.meta}>
          {[metadata.client, metadata.publishedAt && formatDate(metadata.publishedAt)]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <h1 className={styles.title}>{metadata.title}</h1>
        {metadata.summary && <p className={styles.summary}>{metadata.summary}</p>}

        {team.length > 0 && (
          <div className={styles.team}>
            <AvatarGroup people={team.map((member) => ({ name: member.name, src: member.avatar }))} />
            <p className={styles.names}>
              {team.map((member, i) => (
                <span key={member.name}>
                  {i > 0 && ", "}
                  {member.linkedIn ? <Link href={member.linkedIn}>{member.name}</Link> : member.name}
                  {member.role && <span className={styles.role}> · {member.role}</span>}
                </span>
              ))}
            </p>
          </div>
        )}

        {(tags.length > 0 || metadata.link) && (
          <div className={styles.extras}>
            {tags.length > 0 && (
              <ul className={styles.tags} aria-label="Scope">
                {tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
            )}
            {metadata.link && (
              <Link href={metadata.link} kind="standalone">
                View project
              </Link>
            )}
          </div>
        )}
      </header>

      {cover && (
        <div className={styles.cover}>
          <Media src={cover} alt="" priority sizes="(min-width: 1024px) 960px, 100vw" />
        </div>
      )}

      <div className={styles.body}>
        {headings.length > 1 && (
          <aside className={styles.toc}>
            <TableOfContents entries={headings} title="In this case study" />
          </aside>
        )}
        <article className={styles.article}>
          <CustomMDX source={post.content} />
        </article>
      </div>

      <section className={styles.related} aria-labelledby="related-projects">
        <h2 id="related-projects" className={styles.relatedTitle}>
          Related projects
        </h2>
        <Projects exclude={[post.slug]} range={[1]} />
      </section>
    </div>
  );
}
