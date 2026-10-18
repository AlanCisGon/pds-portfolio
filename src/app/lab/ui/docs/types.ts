import type { ReactNode } from "react";

// Documentación del SDS en /lab/ui. Los textos son internos (español) mientras la doc sea privada;
// si se publica, Ameyali los reescribe en inglés (ADR 0001) y pasan por el filtro de sello (§15).

export type ComponentGroup = "actions" | "content" | "data" | "navigation" | "site" | "utility";

export type PropSpec = {
  name: string;
  /** Tipo tal como está en el código. */
  type: string;
  /** Valor por omisión; vacío si es requerido o no tiene. */
  default?: string;
  required?: boolean;
  /** Propiedad equivalente en Figma, si existe. */
  figma?: string;
  description: string;
};

export type ComponentDoc = {
  /** Segmento de la URL: /lab/ui/<slug>. */
  slug: string;
  /** Nombre exportado desde @/sds. */
  name: string;
  group: ComponentGroup;
  /** Nivel atómico declarado en la doc o en el código. */
  level?: "átomo" | "molécula" | "organismo" | "utilidad";
  /** node-id del componente en el archivo de Figma; sin él, la página lo marca como pendiente. */
  figmaNode?: string;
  /** true si todavía no se usa en ninguna página pública. */
  unused?: boolean;
  /** Una oración: qué es y para qué existe. */
  summary: string;
  demo: ReactNode;
  /** Ejemplo mínimo de uso. */
  usage: string;
  props: PropSpec[];
  /** Cuándo usarlo. */
  use: string[];
  /** Cuándo no, y qué usar en su lugar. */
  avoid: string[];
  accessibility: string[];
  /** slugs relacionados. */
  related?: string[];
};

export const GROUPS: Record<ComponentGroup, { code: string; title: string; description: string }> =
  {
    actions: {
      code: "02a",
      title: "Actions",
      description: "Lo que se presiona o se sigue: acciones, enlaces y navegación.",
    },
    content: {
      code: "02b",
      title: "Content",
      description: "Piezas de lectura: etiquetas, estatus, evidencia y prosa.",
    },
    data: {
      code: "02c",
      title: "Data & Media",
      description: "Datos, código, detalle opcional, imágenes y video.",
    },
    navigation: {
      code: "02d",
      title: "Navigation",
      description: "Orientación dentro de una página larga.",
    },
    site: {
      code: "02e",
      title: "Cards & Site",
      description: "Tarjetas, secciones y la estructura del sitio.",
    },
    utility: {
      code: "—",
      title: "Utilidades",
      description: "Ayudas sin forma visual propia.",
    },
  };

export const FIGMA_FILE = "https://www.figma.com/design/DuBGDnVdxcqR7ON3zyzbBL";

export function figmaUrl(node?: string) {
  return node ? `${FIGMA_FILE}?node-id=${node.replace(":", "-")}` : FIGMA_FILE;
}
