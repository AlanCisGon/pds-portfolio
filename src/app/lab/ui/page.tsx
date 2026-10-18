import type { Metadata } from "next";
import { IndexFilters, type IndexItem } from "./IndexFilters";
import { MotionDemo } from "./MotionDemo";
import { fold } from "./docs/fold";
import { DOCS, GROUP_ORDER, getSourceFacts } from "./docs/registry";
import { GROUPS } from "./docs/types";
import styles from "./page.module.css";

// Documentación privada del SDS (detrás del Basic Auth de /lab). Cada componente tiene su spec en
// /lab/ui/<slug>. Se compara contra Figma: SDS · Somara Design System.
export const metadata: Metadata = { title: "Lab · UI", robots: { index: false, follow: false } };

export default async function UiDocs() {
  const unused = DOCS.filter((d) => d.unused).length;
  const label = (g: (typeof GROUP_ORDER)[number]) => `${GROUPS[g].code} · ${GROUPS[g].title}`;
  const groups = GROUP_ORDER.map(label);
  // Solo datos planos al cliente: las demos (ReactNode) se quedan en el servidor.
  // Patrón = combina otros componentes visibles de src/sds (VisuallyHidden es utilidad, no cuenta).
  const composes = async (name: string) => {
    try {
      const kids = Object.keys((await getSourceFacts(name)).childTokens);
      return kids.some((k) => k !== "VisuallyHidden");
    } catch {
      return false;
    }
  };
  const patterns = await Promise.all(DOCS.map((d) => composes(d.name)));
  const items: IndexItem[] = DOCS.map((d, i) => ({
    slug: d.slug,
    name: d.name,
    level: d.level ?? "utilidad",
    summary: d.summary,
    unused: Boolean(d.unused),
    pattern: patterns[i],
    group: label(d.group),
    haystack: fold([d.name, d.summary, ...d.use, ...d.avoid].join(" ")),
  }));

  return (
    <div className={styles.page} lang="es">
      <header className={styles.intro}>
        <p className={styles.eyebrow}>LAB · SOMARA DESIGN SYSTEM</p>
        <h1 className={styles.title}>Componentes</h1>
        <p className={styles.lead}>
          Specs y casos de uso de los {DOCS.length} componentes de <code>@/sds</code>: props, cuándo
          usarlos, accesibilidad y los tokens que leen. {DOCS.length - unused} están en producción.
        </p>
      </header>

      <IndexFilters items={items} groups={groups} />

      <section className={styles.section} id="motion">
        <h2 className={styles.h2}>07 · Motion</h2>
        <p className={styles.body}>
          Prototipos de Félix (página 07 Motion de Figma). Propuestas en revisión de Clara: todavía
          no viven en src/sds.
        </p>
        <MotionDemo />
      </section>
    </div>
  );
}
