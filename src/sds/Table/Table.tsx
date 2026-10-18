import type { ReactNode } from "react";
import styles from "./Table.module.css";

export type TableData = {
  headers: Array<{ key: string; content: ReactNode }>;
  /** Editorial shape used in MDX: one object per row, keyed by header `key`. */
  rows: Array<Record<string, ReactNode>>;
};

/** Case-study table (metrics). Scrolls horizontally inside its container on mobile, never the page. */
export function Table({ data, caption }: { data: TableData; caption?: string }) {
  const headers = Array.isArray(data?.headers) ? data.headers : [];
  const rows = Array.isArray(data?.rows) ? data.rows : [];
  return (
    <section className={styles.wrapper} aria-label={caption} tabIndex={caption ? 0 : undefined}>
      <table className={styles.table}>
        {caption && <caption className={styles.caption}>{caption}</caption>}
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h.key} scope="col" className={styles.th}>
                {h.content}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: rows come from static MDX, have no id and are never reordered
            <tr key={i} className={styles.row}>
              {headers.map((h) => (
                <td key={h.key} className={styles.td}>
                  {row?.[h.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
