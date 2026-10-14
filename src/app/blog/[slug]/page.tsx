import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CustomMDX } from "@/components";
import { baseURL, blog, person } from "@/resources";
import { ArticleCTA, Callout, FootnoteRef, Footnotes, Link, PullQuote } from "@/ui";
import { formatDate } from "@/utils/format";
import { getPost, getPosts } from "@/utils/posts";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import styles from "./page.module.css";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadata({
    title: post.metadata.title,
    description: post.metadata.summary,
    path: `${blog.path}/${post.slug}`,
    type: "article",
    publishedTime: post.metadata.publishedAt,
  });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const { metadata } = post;
  const path = `${blog.path}/${post.slug}`;
  const posts = getPosts();
  const next =
    posts[posts.findIndex((p) => p.slug === post.slug) + 1] ??
    (posts.length > 1 ? posts[0] : undefined);
  const share = {
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${baseURL}${path}`)}`,
    label: blog.cta.share,
  };

  return (
    <div className={styles.page}>
      <JsonLd
        data={pageSchema({
          type: "BlogPosting",
          title: metadata.title,
          description: metadata.summary,
          path,
          datePublished: metadata.publishedAt,
        })}
      />

      <article className={styles.article}>
        <header className={styles.header}>
          <Link href={blog.path} kind="standalone" back>
            {blog.all}
          </Link>
          <p className={styles.eyebrow}>{metadata.eyebrow}</p>
          <h1 className={styles.title}>{metadata.title}</h1>
          <p className={styles.dek}>{metadata.summary}</p>
          <p className={styles.meta}>
            {blog.by} {blog.author} ·{" "}
            <time dateTime={metadata.publishedAt}>{formatDate(metadata.publishedAt)}</time> ·{" "}
            {post.minutes} {blog.minRead}
          </p>
        </header>

        {metadata.disclaimer && <Callout tone="info">{metadata.disclaimer}</Callout>}

        <CustomMDX source={post.content} components={{ FootnoteRef, PullQuote }} />

        {metadata.notes.length > 0 && (
          <Footnotes
            title={blog.notesTitle}
            backLabel={blog.notesBack}
            items={metadata.notes.map((note) => ({
              text: note.href ? (
                <>
                  {note.text} <Link href={note.href}>{new URL(note.href).hostname}</Link>
                </>
              ) : (
                note.text
              ),
            }))}
            credit={metadata.copyeditor && `${blog.copyeditedBy} ${metadata.copyeditor}.`}
          />
        )}

        {next ? (
          <ArticleCTA
            variant="next"
            heading={blog.cta.next.heading}
            href={`${blog.path}/${next.slug}`}
            label={next.metadata.title}
            share={share}
          />
        ) : (
          <ArticleCTA
            variant="contact"
            heading={blog.cta.contact.heading}
            body={blog.cta.contact.body}
            href={`mailto:${person.email}`}
            label={blog.cta.contact.label}
            share={share}
          />
        )}

        <Link href={blog.path} kind="standalone" back>
          {blog.all}
        </Link>
      </article>
    </div>
  );
}
