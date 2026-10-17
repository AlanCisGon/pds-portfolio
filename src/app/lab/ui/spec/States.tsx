import type { CSSProperties, ReactNode } from "react";
import styles from "./spec.module.css";

export type SpecState = "Default" | "Hover" | "Pressed" | "Focus" | "Disabled" | (string & {});

/** Lo que el componente necesita para dibujarse en una celda: fila de Figma y estado. */
export type Specimen = (row: string, state: SpecState) => ReactNode;

const FORCED: Record<string, string> = { Hover: "hover", Pressed: "pressed", Focus: "focus" };

/**
 * Sección 5 de la spec: la matriz de Figma (fila · Estado) con el componente vivo en cada celda.
 * Hover, Pressed y Focus se fuerzan con data-sds-state (ADR 0010); Disabled lo da la prop.
 * Las etiquetas sin " · " son variantes, no estados (Tag, Badge, Avatar…).
 */
export function States({
  labels,
  specimen,
  columns: fixed,
}: {
  labels: string[];
  specimen: Specimen;
  /** Columnas fijas cuando la celda necesita ancho (ProjectCard horizontal, LaunchStrip…). */
  columns?: number;
}) {
  const cells = labels.map((label) => {
    const [row, state = "Default"] = label.split(" · ");
    return { label, row, state };
  });
  const isMatrix = labels.some((l) => l.includes(" · "));
  const columns = isMatrix ? [...new Set(cells.map((c) => c.state))] : [];

  return (
    <div
      className={styles.states}
      style={
        isMatrix || fixed ? ({ "--cols": fixed ?? columns.length } as CSSProperties) : undefined
      }
      data-matrix={isMatrix || fixed ? true : undefined}
    >
      {cells.map(({ label, row, state }) => (
        <figure key={label} className={styles.cell}>
          {/* inert: es un espécimen; sin esto, cada celda sumaría tabs y enlaces repetidos. */}
          <div className={styles.cellStage} data-sds-state={FORCED[state]} inert>
            {specimen(row, state)}
          </div>
          <figcaption className={styles.cellLabel}>{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
