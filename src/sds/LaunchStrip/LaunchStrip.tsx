import { ArrowRight } from "iconoir-react";
import NextLink from "next/link";
import styles from "./LaunchStrip.module.css";

export type LaunchStripProps = {
  href: string;
  /** Lead-in before the title ("A field note on design and load time:"). */
  lead: string;
  /** Linked title, always underlined (WCAG 1.4.1). */
  title: string;
};

/** LaunchStrip · molecule. One line, one link, between subtle borders. No badge, counter or close. One at a time. */
export function LaunchStrip({ href, lead, title }: LaunchStripProps) {
  return (
    <NextLink href={href} className={styles.strip}>
      <span className={styles.lead}>{lead}</span> <span className={styles.title}>{title}</span>
      <ArrowRight aria-hidden="true" className={styles.arrow} />
    </NextLink>
  );
}
