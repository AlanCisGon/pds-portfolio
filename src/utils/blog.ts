import { blog } from "@/resources";
import type { WritingArticle } from "@/ui";
import { formatShortDate } from "@/utils/format";
import { getPosts } from "@/utils/posts";

/** Notes as Writing cards, newest first. */
export function writingArticles(): WritingArticle[] {
  return getPosts().map((post) => ({
    href: `${blog.path}/${post.slug}`,
    eyebrow: blog.section.cardEyebrow,
    title: post.metadata.title,
    dek: post.metadata.cardDek,
    meta: `${formatShortDate(post.metadata.publishedAt)} · ${post.minutes} ${blog.minRead}`,
  }));
}
