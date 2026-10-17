import { Card } from "@/ui";
import type { Metadata } from "next";
import { MotionDemo } from "./MotionDemo";
import { DOCS, GROUP_ORDER } from "./docs/registry";
import { GROUPS } from "./docs/types";
import styles from "./page.module.css";

// Documentación privada del SDS (detrás del Basic Auth de /lab). Cada componente tiene su spec en
// /lab/ui/<slug>. Se compara contra Figma: SDS · Somara Design System.
export const metadata: Metadata = { title: "Lab · UI", robots: { index: false, follow: false } };

export default function UiDocs() {
  const unused = DOCS.filter((d) => d.unused).length;

  return (
    <div className={styles.page} lang="es">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>LAB · SOMARA DESIGN SYSTEM</p>
        <h1 className={styles.title}>Componentes</h1>
        <p className={styles.lead}>
          Specs y casos de uso de los {DOCS.length} componentes de <code>@/ui</code>: props, cuándo
          usarlos, accesibilidad y los tokens que leen. {DOCS.length - unused} están en producción.
        </p>
      </header>

      {GROUP_ORDER.map((g) => {
        const group = GROUPS[g];
        const docs = DOCS.filter((d) => d.group === g);
        return (
          <section className={styles.section} id={g} key={g}>
            <div className={styles.stack}>
              <h2 className={styles.h2}>
                {group.code} · {group.title}
              </h2>
              <p className={styles.body}>{group.description}</p>
            </div>
            <ul className={styles.cards}>
              {docs.map((d) => (
                <li key={d.slug}>
                  <Card
                    href={`/lab/ui/${d.slug}`}
                    eyebrow={d.unused ? `${d.level ?? ""} · sin uso público` : d.level}
                    title={d.name}
                  >
                    {d.summary}
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className={styles.section} id="motion">
        <h2 className={styles.h2}>07 · Motion</h2>
        <p className={styles.body}>
          Prototipos de Félix (página 07 Motion de Figma). Propuestas en revisión de Clara: todavía
          no viven en src/ui.
        </p>
        <MotionDemo />
      </section>
    </div>
  );
}
