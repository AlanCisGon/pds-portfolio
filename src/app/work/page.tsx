import { Projects } from "@/components/work/Projects";
import { work } from "@/resources";
import { JsonLd, pageMetadata, pageSchema } from "@/utils/seo";
import styles from "./page.module.css";

export const metadata = pageMetadata({
  title: work.title,
  description: work.description,
  path: work.path,
});

export default function Work() {
  return (
    <div className={styles.page}>
      <JsonLd
        data={pageSchema({ type: "WebPage", title: work.title, description: work.description, path: work.path })}
      />
      <h1 className={styles.title}>{work.label}</h1>
      <Projects priorityFirst />
    </div>
  );
}
