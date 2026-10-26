import type { Metadata } from "next";

import { Link } from "@/sds";
import { Tuner } from "./Tuner";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Afinador", robots: { index: false, follow: false } };
// Access is checked in proxy.ts; render per request so nothing is cached as a static page.
export const dynamic = "force-dynamic";

/** Classical guitar tuner (lab). The audio never leaves the browser. */
export default function AfinadorPage() {
  return (
    <div className={styles.page} lang="es">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Lab · privado</p>
        <h1 className={styles.title}>Afinador</h1>
        <p className={styles.lead}>Guitarra clásica: estándar u otras afinaciones comunes.</p>
      </header>
      <Tuner />
      <Link href="/lab/acordes" kind="standalone">
        Identificar un acorde
      </Link>
      <p className={styles.note}>El audio se procesa en tu navegador; no se graba ni se envía.</p>
    </div>
  );
}
