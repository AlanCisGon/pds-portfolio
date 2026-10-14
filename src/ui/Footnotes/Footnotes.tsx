import type { ReactNode } from "react";
import { Divider } from "../Divider";
import styles from "./Footnotes.module.css";

export type FootnoteItem = {
  /** Note text. */
  text: ReactNode;
};

export type FootnotesProps = {
  /** Notes in order; note n pairs with <FootnoteRef n={n} />. */
  items: FootnoteItem[];
  /** Section label ("Notes"). */
  title: string;
  /** Accessible name of the back link ("Back to reference"). */
  backLabel: string;
  /** Closing credit line (copyediting). */
  credit?: ReactNode;
};

const noteId = (n: number) => `fn-${n}`;
const refId = (n: number) => `fnref-${n}`;

/** FootnoteRef · superscript link to note n; the note links back here. */
export function FootnoteRef({ n }: { n: number }) {
  return (
    <sup className={styles.ref}>
      <a
        id={refId(n)}
        href={`#${noteId(n)}`}
        className={styles.refLink}
        aria-describedby="footnotes-title"
      >
        {n}
      </a>
    </sup>
  );
}

/** Footnotes · molecule. Bidirectional references [n] ↔ ↩, then an optional credit. */
export function Footnotes({ items, title, backLabel, credit }: FootnotesProps) {
  return (
    <section className={styles.footnotes} aria-labelledby="footnotes-title">
      <Divider />
      <h2 id="footnotes-title" className={styles.title}>
        {title}
      </h2>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const n = index + 1;
          return (
            <li key={n} id={noteId(n)} className={styles.item}>
              {item.text}{" "}
              <a href={`#${refId(n)}`} className={styles.back} aria-label={`${backLabel} ${n}`}>
                ↩
              </a>
            </li>
          );
        })}
      </ol>
      {credit && <p className={styles.credit}>{credit}</p>}
    </section>
  );
}
