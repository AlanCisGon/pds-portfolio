import {
  Accordion,
  Carousel,
  ChordDiagram,
  CodeBlock,
  Gauge,
  HeadingLink,
  Media,
  Tab,
  Table,
  TableOfContents,
} from "@/sds";
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
  {
    slug: "gauge",
    name: "Gauge",
    group: "data",
    level: "molécula",
    figmaNode: "467:127",
    unused: true,
    summary:
      "Medidor semicircular centrado en un objetivo: cuánto se desvía una lectura y hacia qué lado. Solo muestra; no se toca.",
    demo: (
      <div className={styles.stack}>
        <Gauge value={null} zone={5} label="Sin lectura" valueText="Sin lectura">
          <span>Sin lectura</span>
        </Gauge>
        <Gauge value={-18} zone={5} label="Desviación" valueText="18 cents grave">
          <span>−18 cents</span>
        </Gauge>
        <Gauge value={2} zone={5} tone="success" label="Desviación" valueText="2 cents, afinada">
          <span>Afinada</span>
        </Gauge>
      </div>
    ),
    usage: `<Gauge value={cents} zone={5} tone={inTune ? "success" : "neutral"} label="Desviación, en cents" valueText="12 cents grave">
  <span>La</span>
</Gauge>`,
    props: [
      {
        name: "value",
        type: "number | null",
        required: true,
        description: "Lectura actual; se recorta a min/max. null deja la aguja al centro, en gris.",
      },
      { name: "min", type: "number", default: "-50", description: "Extremo izquierdo." },
      { name: "max", type: "number", default: "50", description: "Extremo derecho." },
      {
        name: "zone",
        type: "number",
        default: "0",
        figma: "Zone",
        description:
          "Medio ancho de la banda objetivo alrededor del centro, en las unidades de value.",
      },
      {
        name: "tone",
        type: '"neutral" | "success" | "danger"',
        default: '"neutral"',
        figma: "Tone",
        description:
          "Estatus de la aguja (capa contextual). Nunca Cerezo: el medidor no es interactivo.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Nombre accesible del medidor.",
      },
      {
        name: "valueText",
        type: "string",
        description: 'La lectura en palabras (aria-valuetext), p. ej. "12 cents grave".',
      },
      {
        name: "children",
        type: "ReactNode",
        figma: "Readout",
        description: "Lectura dentro del arco: la cifra o nota a la que apunta la aguja.",
      },
    ],
    use: [
      "Una desviación continua respecto a un objetivo, como la afinación del afinador del lab.",
    ],
    avoid: [
      "Para una cifra con fuente: usa Stat.",
      "Para un avance de 0 a 100: hace falta una barra de progreso, no un medidor centrado.",
    ],
    accessibility: [
      'role="meter" con aria-valuemin/max/now y aria-valuetext; el SVG es decorativo.',
      "El tono nunca va solo: la página dice el estado en texto, con aria-live si cambia en vivo.",
      "Sin transición propia de la aguja: quien la usa la suaviza, y con movimiento reducido salta.",
    ],
    related: ["stat", "badge"],
  },
  {
    slug: "chord-diagram",
    name: "ChordDiagram",
    group: "data",
    level: "molécula",
    unused: true,
    summary:
      "Diagrama de un acorde: dónde va cada dedo en el mástil, con cuerdas al aire, apagadas y cejilla. Solo muestra.",
    demo: (
      <div className={styles.stack}>
        <ChordDiagram
          frets={[null, 3, 2, 0, 1, 0]}
          fingers={[null, 3, 2, null, 1, null]}
          strings={["Mi", "La", "Re", "Sol", "Si", "Mi"]}
          label="Do mayor: x 3 2 0 1 0"
        />
        <ChordDiagram
          frets={[1, 3, 3, 2, 1, 1]}
          fingers={[1, 3, 4, 2, 1, 1]}
          barre={{ fret: 1, from: 0 }}
          label="Fa mayor con cejilla: 1 3 3 2 1 1"
        />
      </div>
    ),
    usage: `<ChordDiagram frets={[null, 3, 2, 0, 1, 0]} fingers={[null, 3, 2, null, 1, null]} strings={["Mi", "La", "Re", "Sol", "Si", "Mi"]} label="Do mayor: x 3 2 0 1 0" />`,
    props: [
      {
        name: "frets",
        type: "(number | null)[]",
        required: true,
        description: "Traste por cuerda, de la 6ª a la 1ª: null apagada, 0 al aire.",
      },
      {
        name: "fingers",
        type: "(number | null)[]",
        description: "Dedo por cuerda (1 índice … 4 meñique); null al aire o apagada.",
      },
      {
        name: "barre",
        type: "{ fret: number; from: number } | null",
        description: "Cejilla con el índice en fret, desde la cuerda from hasta la 1ª.",
      },
      {
        name: "strings",
        type: "string[]",
        description: "Nombre de cada cuerda al aire bajo el diagrama (la afinación).",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Nombre accesible: el acorde y sus trastes en palabras.",
      },
    ],
    use: ["Mostrar cómo se toca un acorde, como en el identificador de acordes del lab."],
    avoid: [
      "Para leer una secuencia de notas en el tiempo: hace falta una tablatura de varias columnas.",
      "Para un acorde que la persona debe tocar en otra afinación: genera las formas con esa afinación.",
    ],
    accessibility: [
      'role="img" con label: el SVG es decorativo y el nombre dice el acorde y sus trastes.',
      "Sin color: puntos en text/primary, número del dedo en bg/page, marcas en text/secondary.",
      "Hasta el cuarto traste muestra la cejuela; más arriba, el número del traste inicial.",
    ],
    related: ["tab"],
  },
  {
    slug: "tab",
    name: "Tab",
    group: "data",
    level: "átomo",
    unused: true,
    summary:
      "Un acorde en tablatura: seis líneas, la 1ª cuerda arriba, con el traste sobre cada línea. Solo muestra.",
    demo: (
      <Tab
        frets={[null, 3, 2, 0, 1, 0]}
        strings={["Mi", "La", "Re", "Sol", "Si", "Mi"]}
        label="Do mayor"
      />
    ),
    usage: `<Tab frets={[null, 3, 2, 0, 1, 0]} strings={["Mi", "La", "Re", "Sol", "Si", "Mi"]} label="Do mayor" />`,
    props: [
      {
        name: "frets",
        type: "(number | null)[]",
        required: true,
        description: "Traste por cuerda, de la 6ª a la 1ª: null apagada (×), 0 al aire.",
      },
      {
        name: "strings",
        type: "string[]",
        required: true,
        description: "Nombre de cada cuerda, de la 6ª a la 1ª; se muestran de arriba (1ª) abajo.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "El acorde; el nombre accesible suma cada cuerda en palabras.",
      },
    ],
    use: ["Junto a un ChordDiagram, para quien lee tablatura en lugar de diagramas."],
    avoid: ["Para una melodía o un arpegio: esta tablatura es una sola columna (un acorde)."],
    accessibility: [
      'role="img": se lee "6ª apagada, 5ª traste 3…", no los números sueltos.',
      "El traste tapa la línea con --tab-bg: ajústalo si va sobre una superficie que no sea bg/page.",
    ],
    related: ["chord-diagram"],
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
