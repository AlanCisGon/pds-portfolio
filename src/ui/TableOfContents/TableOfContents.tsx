"use client";

import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.css";

export type TocEntry = { id: string; label: string };

/** Figma: TocItem. Active = section in view (Cerezo indicator and number). */
export function TocItem({ href, number, label, active = false }: { href: string; number: string; label: string; active?: boolean }) {
  return (
    <a href={href} className={styles.item} data-active={active || undefined} aria-current={active ? "location" : undefined}>
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.number} aria-hidden="true">
        {number}
      </span>
      <span>{label}</span>
    </a>
  );
}

/** Section index of a case study, numbered (structure shown with numbering). Tracks the section in view. */
export function TableOfContents({ entries, title = "En este caso" }: { entries: TocEntry[]; title?: string }) {
  const [active, setActive] = useState(entries[0]?.id);

  useEffect(() => {
    const targets = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (records) => {
        const visible = records.filter((r) => r.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    for (const t of targets) observer.observe(t);
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav className={styles.toc} aria-label={title}>
      <p className={styles.eyebrow}>{title}</p>
      <ol className={styles.list}>
        {entries.map((e, i) => (
          <li key={e.id}>
            <TocItem href={`#${e.id}`} number={String(i + 1).padStart(2, "0")} label={e.label} active={e.id === active} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
