import { Accordion, Carousel, CodeBlock, HeadingLink, Media, Table, TableOfContents } from "@/sds";
import styles from "../page.module.css";
import type { ComponentDoc } from "./types";

const helix = "/images/projects/helix";

export const data: ComponentDoc[] = [
  {
    slug: "table",
    name: "Table",
    group: "data",
    level: "molécula",
    summary:
      "Tabla de métricas de un caso. En móvil se desplaza dentro de su contenedor, nunca la página.",
    demo: (
      <Table
        caption="Métricas · ejemplo"
        data={{
          headers: [
            { key: "metric", content: "Métrica" },
            { key: "result", content: "Resultado" },
            { key: "impact", content: "Impacto" },
          ],
          rows: [
            { metric: "Conversión web", result: "+2 pp", impact: "Duplicó la eficiencia" },
            { metric: "Conversión app", result: "+0.1 pp", impact: "Se sostuvo" },
          ],
        }}
      />
    ),
    usage: `<Table caption="Results" data={{ headers: [{ key: "metric", content: "Metric" }], rows: [{ metric: "Web conversion" }] }} />`,
    props: [
      {
        name: "data",
        type: "{ headers: { key; content }[]; rows: Record<string, ReactNode>[] }",
        required: true,
        description: "Una fila por objeto, con las llaves de los encabezados.",
      },
      {
        name: "caption",
        type: "string",
        description:
          "Nombre de la tabla. Con él, el contenedor es enfocable para desplazarlo con teclado.",
      },
    ],
    use: ["Comparar varias métricas o etapas con las mismas columnas."],
    avoid: ["Una sola cifra destacada: usa Stat.", "Pares etiqueta/valor: usa FactSheet."],
    accessibility: [
      "Con caption, el contenedor tiene aria-label y tabIndex=0: el desplazamiento horizontal funciona con teclado.",
    ],
    related: ["stat", "fact-sheet"],
  },
  {
    slug: "code-block",
    name: "CodeBlock",
    group: "data",
    level: "molécula",
    summary: "Código en casos y en el lab, con botón de copiar.",
    demo: <CodeBlock language="TSX" code={'import { Tag } from "@/sds";\n\n<Tag>Claude</Tag>'} />,
    usage: `<CodeBlock language="TSX" code={source} />`,
    props: [
      { name: "code", type: "string", required: true, description: "El código, tal cual." },
      { name: "language", type: "string", description: 'Se muestra en el encabezado ("TSX").' },
    ],
    use: ["Fragmentos que alguien va a copiar."],
    avoid: ["Un nombre de código dentro de la prosa: usa <code> en línea."],
    accessibility: ['Copiar confirma con aria-live ("Code copied"), sin Toast.'],
  },
  {
    slug: "accordion",
    name: "Accordion",
    group: "data",
    level: "molécula",
    summary: "Detalle opcional: la síntesis queda arriba y el proceso adentro.",
    demo: (
      <div className={styles.stack}>
        <Accordion title="¿Cómo medimos el impacto?">
          Con la conversión por canal antes y después del rediseño, en el mismo periodo del año.
        </Accordion>
        <Accordion title="Abierto por defecto" defaultOpen>
          El panel se expande desde su lugar y el chevron rota 180°.
        </Accordion>
      </div>
    ),
    usage: `<Accordion title="How did we measure it?">…</Accordion>`,
    props: [
      {
        name: "title",
        type: "string",
        required: true,
        figma: "Title",
        description: "La pregunta o el tema.",
      },
      { name: "children", type: "ReactNode", required: true, description: "El detalle." },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        figma: "Expanded",
        description: "Abierto al cargar.",
      },
    ],
    use: ["Metodología, detalle técnico o preguntas frecuentes que no todos necesitan."],
    avoid: ["Para lo que todos deben leer: déjalo visible.", "Para ocultar evidencia clave."],
    accessibility: ["<details>/<summary> nativo: teclado y lector de pantalla sin JS."],
    related: ["callout"],
  },
  {
    slug: "media",
    name: "Media",
    group: "data",
    level: "molécula",
    summary: "Imagen o video con proporción reservada y pie opcional.",
    demo: (
      <div className={styles.grid}>
        <Media
          src={`${helix}/checkout-flow.webp`}
          alt="Flujo de checkout rediseñado"
          caption="16:9"
        />
        <Media ratio="4:3" caption="Sin imagen: placeholder tonal" />
        <Media
          ratio="1:1"
          src={`${helix}/unified-cart.webp`}
          alt="Carrito unificado"
          caption="1:1"
        />
      </div>
    ),
    usage: `<Media src="/images/x.webp" alt="What the image shows" ratio="4:3" caption="…" />`,
    props: [
      {
        name: "kind",
        type: '"image" | "video"',
        default: '"image"',
        figma: "Kind",
        description: "Tipo de medio.",
      },
      { name: "src", type: "string", description: "Sin él se ve un placeholder tonal." },
      {
        name: "alt",
        type: "string",
        description: "Obligatorio en imágenes: describe lo que muestra.",
      },
      {
        name: "ratio",
        type: '"16:9" | "4:3" | "1:1"',
        default: '"16:9"',
        figma: "Ratio",
        description: "La caja la reserva: no hay layout shift.",
      },
      {
        name: "caption",
        type: "string",
        figma: "Caption",
        description: "Omitirlo apaga showCaption.",
      },
      { name: "poster", type: "string", description: "Póster del video." },
      {
        name: "priority",
        type: "boolean",
        description: "Para la imagen principal de la página (LCP).",
      },
      { name: "sizes", type: "string", description: "Pista de tamaños para next/image." },
    ],
    use: ["Pantallas y artefactos de un caso.", "Video con botón de play en Cerezo."],
    avoid: ["Varias imágenes del mismo momento: usa Carousel.", "Imágenes puramente decorativas."],
    accessibility: [
      "Sin autoplay con sonido; controles nativos después de iniciar.",
      'El play anuncia "Play video: <caption>".',
    ],
    related: ["carousel"],
  },
  {
    slug: "carousel",
    name: "Carousel",
    group: "data",
    level: "organismo",
    unused: true,
    summary: "Varias imágenes de un caso. Sin autoplay; flechas del teclado.",
    demo: (
      <Carousel
        label="Project Helix"
        images={[
          { src: `${helix}/cart-cover.webp`, alt: "Portada del carrito" },
          { src: `${helix}/checkout-flow.webp`, alt: "Flujo de checkout" },
          { src: `${helix}/coppel-credit.webp`, alt: "Crédito Coppel" },
        ]}
      />
    ),
    usage: `<Carousel label="Project Helix" images={[{ src, alt }]} />`,
    props: [
      {
        name: "images",
        type: "Array<{ src: string; alt: string }>",
        required: true,
        description: "Imágenes en orden.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Nombre accesible del grupo, p. ej. el caso.",
      },
    ],
    use: ["Una secuencia de pantallas que se entiende en orden."],
    avoid: [
      "Para una sola imagen: usa Media.",
      "Contenido que todos deben ver: el carrusel lo esconde.",
    ],
    accessibility: [
      'Patrón APG: aria-roledescription carousel/slide, "n of N" por diapositiva.',
      '← y → en el visor; los puntos dicen "Go to image n".',
      "Con movimiento reducido cambia por fundido.",
    ],
    related: ["media", "icon-button"],
  },
];

export const navigation: ComponentDoc[] = [
  {
    slug: "table-of-contents",
    name: "TableOfContents",
    group: "navigation",
    level: "molécula",
    summary: "Índice numerado de un caso que sigue la sección a la vista.",
    demo: (
      <TableOfContents
        entries={[
          { id: "spec-props", label: "Props" },
          { id: "spec-use", label: "Cuándo usarlo" },
          { id: "spec-a11y", label: "Accesibilidad" },
        ]}
      />
    ),
    usage: `<TableOfContents entries={[{ id: "context", label: "Context" }]} />`,
    props: [
      {
        name: "entries",
        type: "Array<{ id: string; label: string }>",
        required: true,
        description: "Secciones, con el id de su encabezado.",
      },
      {
        name: "title",
        type: "string",
        default: '"On this page"',
        description: "Nombre accesible del <nav>.",
      },
    ],
    use: ["Casos y artículos de 8 minutos o más."],
    avoid: ["Notas cortas del blog (menos de 8 minutos)."],
    accessibility: [
      '<nav aria-label>; el activo lleva aria-current="location"; los números son decorativos.',
    ],
    related: ["heading-link"],
  },
  {
    slug: "heading-link",
    name: "HeadingLink",
    group: "navigation",
    level: "átomo",
    summary: "Encabezado de sección con ancla para copiar el enlace.",
    demo: <HeadingLink id="demo-heading">Resultados</HeadingLink>,
    usage: `<HeadingLink id="results">Results</HeadingLink>`,
    props: [
      { name: "id", type: "string", required: true, description: "Ancla de la sección." },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Heading",
        description: "Texto del encabezado.",
      },
      {
        name: "as",
        type: '"h2" | "h3" | "h4"',
        default: '"h2"',
        description: "Nivel, según la jerarquía de la página.",
      },
    ],
    use: ["Secciones a las que alguien querría enlazar directo."],
    avoid: ["Saltarse niveles de encabezado para lograr un tamaño."],
    accessibility: ['El botón dice "Copy link to section" y confirma con aria-live.'],
    related: ["table-of-contents"],
  },
];
