import type { Metadata } from "next";

import styles from "../afinador/page.module.css";
import { ChordFinder } from "./ChordFinder";

export const metadata: Metadata = { title: "Acordes", robots: { index: false, follow: false } };
// Access is checked in proxy.ts; render per request so nothing is cached as a static page.
export const dynamic = "force-dynamic";

/** Chord finder (lab): strum a chord, see its name and how to play it. Audio stays in the browser. */
export default function AcordesPage() {
  return (
    <div className={styles.page} lang="es">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Lab · privado</p>
        <h1 className={styles.title}>Acordes</h1>
        <p className={styles.lead}>
          Rasguea un acorde y déjalo sonar: te digo cuál es y cómo se toca.
        </p>
      </header>
      <ChordFinder />
      <p className={styles.note}>El audio se procesa en tu navegador; no se graba ni se envía.</p>
    </div>
  );
}
