import { blog } from "@/resources";
import { WritingSection } from "@/sds";
import { writingArticles } from "@/utils/blog";
import { pageMetadata } from "@/utils/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: blog.title,
  description: blog.description,
  path: blog.path,
});

/** Minimal index (#50): every note, newest first. */
export default function Blog() {
  const articles = writingArticles();
  return (
    <div className={styles.page}>
      <WritingSection
        title={blog.indexTitle}
        subtitle={blog.section.subtitle}
        articles={articles}
        cta={blog.section.cardCta}
        all={{ href: blog.path, label: blog.all }}
        showAll={false}
        headingLevel={1}
      />
    </div>
  );
}
