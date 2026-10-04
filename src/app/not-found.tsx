import { ArrowRight } from "iconoir-react";

import { Button } from "@/ui";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.text}>The page you are looking for does not exist or has moved.</p>
      <Button href="/" variant="secondary" trailingIcon={<ArrowRight />}>
        Back to home
      </Button>
    </section>
  );
}
