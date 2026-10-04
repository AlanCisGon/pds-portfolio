import type { Metadata } from "next";

import { Card } from "@/ui";
import { labManifest } from "@/utils/labAuth";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Lab", robots: { index: false, follow: false } };
// Access is checked in proxy.ts; render per request so nothing is cached as a static page.
export const dynamic = "force-dynamic";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

/** Private index (proposal on src/ui): app pages and single-file artifacts, newest first. */
export default function LabIndex() {
  const entries = [...labManifest].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className={styles.page} lang="es">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Lab · privado</p>
        <h1 className={styles.title}>Lab</h1>
        <p className={styles.lead}>
          Artefactos y páginas de trabajo, fuera del índice de buscadores. {entries.length}{" "}
          {entries.length === 1 ? "entrada" : "entradas"}.
        </p>
      </header>

      <ul className={styles.grid}>
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Card
              eyebrow={`${entry.href ? "Página" : "Artefacto"} · ${formatDate(entry.createdAt)}`}
              title={entry.title}
              href={entry.href ?? `/lab/${encodeURIComponent(entry.slug)}`}
            >
              {entry.description}
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
