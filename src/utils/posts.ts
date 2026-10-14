import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "app", "blog", "posts");
const WORDS_PER_MINUTE = 230;

/** Front matter of a blog note (src/app/blog/posts/<slug>.mdx). Theory of the discipline only: never tied to a case. */
export type PostMeta = {
  title: string;
  /** Eyebrow on the note ("Field note · Product design"). */
  eyebrow: string;
  /** Dek under the title; also the meta description. */
  summary: string;
  /** Shorter dek for the Home card. */
  cardDek: string;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  tags: string[];
  /** Copyeditor credit, with consent to publish the name. */
  copyeditor: string;
  /** Up front: what the numbers are (hypothetical, illustrative). */
  disclaimer: string;
  /** Footnote texts; note n pairs with <FootnoteRef n={n} /> in the body. */
  notes: Array<{ text: string; href?: string }>;
};

export type Post = { slug: string; metadata: PostMeta; content: string; minutes: number };

function readPost(file: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf-8"));
  const words = content
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return {
    slug: path.basename(file, ".mdx"),
    content,
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    metadata: {
      title: data.title ?? "",
      eyebrow: data.eyebrow ?? "",
      summary: data.summary ?? "",
      cardDek: data.cardDek ?? data.summary ?? "",
      publishedAt: data.publishedAt ?? "",
      tags: data.tags ?? [],
      copyeditor: data.copyeditor ?? "",
      disclaimer: data.disclaimer ?? "",
      notes: data.notes ?? [],
    },
  };
}

/** All notes, newest first. */
export function getPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(readPost)
    .sort((a, b) => b.metadata.publishedAt.localeCompare(a.metadata.publishedAt));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}
