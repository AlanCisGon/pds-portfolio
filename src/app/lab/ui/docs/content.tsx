import {
  Avatar,
  AvatarGroup,
  Badge,
  Callout,
  Divider,
  FactSheet,
  FootnoteRef,
  Footnotes,
  List,
  ListItem,
  PullQuote,
  Stat,
  StatGrid,
  Tag,
} from "@/sds";
import { SiClaude, SiFigma } from "@icons-pack/react-simple-icons";
import styles from "../page.module.css";
import type { ComponentDoc } from "./types";

const tones = ["neutral", "info", "success", "warning", "danger"] as const;
const toneType = '"neutral" | "info" | "success" | "warning" | "danger"';

export const content: ComponentDoc[] = [
  {
    slug: "tag",
    name: "Tag",
    group: "content",
    level: "átomo",
    summary: "Etiqueta informativa: disciplina, herramienta o tipo de pieza. No es interactiva.",
    demo: (
      <div className={styles.row}>
        <Tag leadingIcon={<SiClaude title="" />}>Claude</Tag>
        <Tag leadingIcon={<SiFigma title="" />}>Figma</Tag>
        <Tag size="small">Service Design</Tag>
      </div>
    ),
    usage: `<Tag leadingIcon={<SiFigma title="" />}>Figma</Tag>
<Tag size="small">Service Design</Tag>`,
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Label",
        description: "Texto visible.",
      },
      {
        name: "size",
        type: '"medium" | "small"',
        default: '"medium"',
        figma: "Size",
        description: "En Figma todavía es Medium/Small (pendiente S2: m/s).",
      },
      {
        name: "leadingIcon",
        type: "ReactNode",
        figma: "LeadingIcon",
        description: "Iconoir o Simple Icons. Omitir lo oculta (showLeadingIcon).",
      },
    ],
    use: ["Disciplinas y herramientas de un caso.", "Metadatos que se escanean de un vistazo."],
    avoid: [
      "Si se puede tocar (filtrar, quitar): usa Chip.",
      "Si comunica un estado: usa Badge.",
      "Nunca en Cerezo: no es interactivo.",
    ],
    accessibility: ["El ícono es aria-hidden: el texto ya nombra la herramienta."],
    related: ["chip", "badge"],
  },
  {
    slug: "divider",
    name: "Divider",
    group: "content",
    level: "átomo",
    summary:
      "Línea de 1 px en --color-border-subtle. Se usa poco: la marca separa por tono y espacio.",
    demo: (
      <div className={styles.stack}>
        <p className={styles.body}>Arriba</p>
        <Divider />
        <p className={styles.body}>Abajo</p>
      </div>
    ),
    usage: "<Divider />",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Vertical para separar elementos en una fila.",
      },
    ],
    use: [
      "Antes de un bloque de evidencia (Stat) o de las notas.",
      "Cuando el espacio solo no basta para cerrar una unidad.",
    ],
    avoid: ["Entre tarjetas o secciones que ya cambian de superficie.", "Como decoración."],
    accessibility: ["Es un <hr> nativo; el vertical lleva aria-orientation."],
    related: ["stat", "footnotes"],
  },
  {
    slug: "avatar",
    name: "Avatar",
    group: "content",
    level: "átomo",
    figmaNode: "29:13",
    summary: "Foto o iniciales de una persona, en cuatro tamaños.",
    demo: (
      <div className={styles.row}>
        <Avatar name="Alan Cisneros" size="s" />
        <Avatar name="Alan Cisneros" size="m" />
        <Avatar name="Alan Cisneros" size="l" src="/images/avatar.jpg" />
        <Avatar name="Alan Cisneros" size="xl" src="/images/avatar.jpg" />
      </div>
    ),
    usage: `<Avatar name="Alan Cisneros" src="/images/avatar.jpg" size="l" />`,
    props: [
      {
        name: "name",
        type: "string",
        required: true,
        description: "Texto alternativo de la foto y fuente de las iniciales.",
      },
      {
        name: "size",
        type: '"s" | "m" | "l" | "xl"',
        default: '"m"',
        figma: "Size",
        description: "24, 32, 48 y 64 px.",
      },
      {
        name: "src",
        type: "string",
        figma: "Src",
        description: "Foto. Sin ella se ven las iniciales.",
      },
      {
        name: "initials",
        type: "string",
        figma: "Initials",
        description: "Por omisión, las primeras letras de name.",
      },
      {
        name: "decorative",
        type: "boolean",
        default: "false",
        description: 'Cuando el nombre ya se ve al lado (alt="").',
      },
    ],
    use: ["Junto al nombre de quien escribió o participó.", "Dentro de TeamCard y AvatarGroup."],
    avoid: [
      "Sin nombre visible ni accesible.",
      "Fotos desligadas en Figma: la foto es override por instancia.",
    ],
    accessibility: [
      'Con foto, alt = name; sin foto, role="img" y aria-label = name.',
      "decorative lo saca del árbol cuando el nombre ya está escrito al lado.",
    ],
    related: ["avatar-group", "team-card"],
  },
  {
    slug: "avatar-group",
    name: "AvatarGroup",
    group: "content",
    level: "molécula",
    summary: "Equipo de un caso: hasta tres avatares y un +N para el resto.",
    demo: (
      <AvatarGroup
        people={[
          { name: "Alan Cisneros" },
          { name: "Juana Martínez" },
          { name: "Luis Ramos" },
          { name: "Ana Pérez" },
        ]}
      />
    ),
    usage: `<AvatarGroup people={[{ name: "Alan Cisneros", src: "/images/avatar.jpg" }, { name: "Fer" }]} />`,
    props: [
      {
        name: "people",
        type: "Array<{ name: string; src?: string }>",
        required: true,
        description: "Personas del equipo.",
      },
      { name: "max", type: "number", default: "3", description: "Cuántos se ven antes del +N." },
    ],
    use: ["En el par Team del FactSheet (opción B).", "En FeaturedCase."],
    avoid: ["Para presentar a cada persona con su rol: usa TeamCard."],
    accessibility: ['Es una lista (<ul aria-label="Team">); el +N se anuncia como "and N more".'],
    related: ["avatar", "fact-sheet", "team-card"],
  },
  {
    slug: "badge",
    name: "Badge",
    group: "content",
    level: "átomo",
    figmaNode: "30:35",
    summary: "Estatus de algo (capa contextual). Ícono y texto: nunca solo color.",
    demo: (
      <div className={styles.row}>
        {tones.map((t) => (
          <Badge key={t} tone={t}>
            {t}
          </Badge>
        ))}
        <Badge showIcon={false}>sin ícono</Badge>
      </div>
    ),
    usage: `<Badge tone="warning">In review</Badge>`,
    props: [
      {
        name: "tone",
        type: toneType,
        default: '"neutral"',
        figma: "Tone",
        description: "Estatus, de la capa --status-*.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Label",
        description: "El texto nombra el estatus.",
      },
      {
        name: "showIcon",
        type: "boolean",
        default: "true",
        figma: "showIcon",
        description: "Déjalo encendido. Sin ícono, el padding pasa a --space-8.",
      },
    ],
    use: [
      "Estado de una pieza: pendiente, en revisión, publicado.",
      "El pending de Stat cuando falta evidencia.",
    ],
    avoid: ["Para categorías: usa Tag.", "Como botón: no es interactivo."],
    accessibility: [
      "El color nunca es la única señal: el texto dice el estatus y el ícono lo refuerza.",
    ],
    related: ["tag", "callout", "stat"],
  },
  {
    slug: "callout",
    name: "Callout",
    group: "content",
    level: "molécula",
    summary: "Aviso dentro de un caso: contexto, resultado, atención o riesgo.",
    demo: (
      <div className={styles.grid}>
        {tones.map((t) => (
          <Callout
            key={t}
            tone={t}
            title={
              {
                info: "Contexto",
                success: "Resultado",
                warning: "Atención",
                danger: "Riesgo",
                neutral: "Nota",
              }[t]
            }
          >
            Una idea por aviso; la evidencia antes que los adjetivos.
          </Callout>
        ))}
      </div>
    ),
    usage: `<Callout tone="info" title="Context">One idea per callout.</Callout>`,
    props: [
      {
        name: "tone",
        type: toneType,
        default: '"info"',
        figma: "Tone",
        description: "Tono de estatus.",
      },
      {
        name: "title",
        type: "string",
        figma: "Title",
        description: "Omitirlo equivale a showTitle apagado.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Body",
        description: "Una sola idea.",
      },
    ],
    use: [
      "Para sacar del flujo algo que el lector no debe perder.",
      "Un aviso por sección, como máximo.",
    ],
    avoid: [
      "Para citas: usa PullQuote.",
      "Para detalle opcional: usa Accordion.",
      "Varios seguidos: pierden fuerza.",
    ],
    accessibility: ["Es un <aside> con aria-label = title; el ícono es decorativo."],
    related: ["badge", "pull-quote", "accordion"],
  },
  {
    slug: "list",
    name: "List",
    group: "content",
    level: "átomo",
    summary: "Listas del MDX: raya (—) como marca de taller, o números.",
    demo: (
      <div className={styles.grid}>
        <List>
          <ListItem>Investigar pronto, prototipar rápido y probar en pequeño.</ListItem>
          <ListItem>Construir con el cliente en el centro.</ListItem>
        </List>
        <List ordered>
          <ListItem>Entender el problema.</ListItem>
          <ListItem>Proponer la solución.</ListItem>
        </List>
      </div>
    ),
    usage: `<List ordered>
  <ListItem>Understand the problem.</ListItem>
</List>`,
    props: [
      {
        name: "ordered",
        type: "boolean",
        default: "false",
        description: "Numerada (contador sds-list).",
      },
      { name: "children", type: "ReactNode", required: true, description: "ListItem." },
    ],
    use: ["Pasos con orden (ordered).", "Enumeraciones cortas en la prosa."],
    avoid: ["Para pares etiqueta/valor: usa FactSheet.", "Para datos comparables: usa Table."],
    accessibility: ["<ul>/<ol> nativos: los lectores anuncian cuántos elementos hay."],
    related: ["fact-sheet", "table"],
  },
  {
    slug: "stat",
    name: "Stat",
    group: "content",
    level: "molécula",
    figmaNode: "177:92",
    summary:
      "Evidencia: incremento + unidad + qué se midió + periodo · fuente. La honestidad vive en la API.",
    demo: (
      <StatGrid>
        <Stat
          value="+2"
          unit="pp"
          label="Web conversion"
          period="Jan 2026"
          source="Digital analytics"
          accessibleValue="+2 percentage points"
          pendingLabel="Not verified yet"
        />
        <Stat unit="pts" label="Sin fuente: estado pending" pendingLabel="Not verified yet" />
      </StatGrid>
    ),
    usage: `<StatGrid>
  <Stat value="+2" unit="pp" label="Web conversion" period="Jan 2026"
    source="Digital analytics" accessibleValue="+2 percentage points"
    pendingLabel="Not verified yet" />
</StatGrid>`,
    props: [
      {
        name: "value",
        type: "string",
        description: 'Incremento con signo ("+2", "−60" con U+2212). Nunca absolutos.',
      },
      {
        name: "unit",
        type: '"pp" | "pts" | "%"',
        required: true,
        description: "pp tasas, pts puntajes, % cambio relativo.",
      },
      { name: "label", type: "string", required: true, description: "Qué se midió." },
      { name: "period", type: "string", description: "Cuándo." },
      { name: "source", type: "string", description: "Quién lo midió." },
      {
        name: "accessibleValue",
        type: "string",
        description: "Lectura completa para lectores de pantalla.",
      },
      {
        name: "pendingLabel",
        type: "ReactNode",
        required: true,
        description: "Texto del Badge si falta valor, periodo o fuente.",
      },
    ],
    use: [
      "Resultados de un caso, dentro de StatGrid (2 columnas) y con Divider arriba.",
      "Desde MDX, con <CaseStats>.",
    ],
    avoid: [
      "Cifras absolutas de Coppel: son confidenciales.",
      "Un caso sin ninguna métrica completa: no se muestra el bloque.",
      "Para datos de contexto: usa FactSheet o Table.",
    ],
    accessibility: ["Con accessibleValue, la cifra visual se oculta y se lee la frase completa."],
    related: ["badge", "fact-sheet", "table", "divider"],
  },
  {
    slug: "fact-sheet",
    name: "FactSheet",
    group: "content",
    level: "molécula",
    figmaNode: "177:128",
    summary: "Ficha del caso: de 1 a 5 pares etiqueta/valor arriba de la portada.",
    demo: (
      <FactSheet
        items={[
          { label: "Client", value: "Coppel" },
          { label: "My role", value: "Design Lead" },
          { label: "Team", value: "3 UI · 2 UX · 1 UX writer", wide: true },
          { label: "Dates", value: "Q4 2024 – Sep 2025" },
          { label: "Industry", value: "" },
        ]}
      />
    ),
    usage: `<FactSheet items={[{ label: "Client", value: "Coppel" }, { label: "Team", value: <AvatarGroup … />, wide: true }]} />`,
    props: [
      {
        name: "items",
        type: "Array<{ label: string; value?: ReactNode; wide?: boolean }>",
        required: true,
        description: "Pares. Si falta un valor, el par se omite; nunca se rellena.",
      },
    ],
    use: [
      "Client, My role, Team, Dates, Industry, en ese orden.",
      "Team ocupa dos columnas (wide) con AvatarGroup.",
    ],
    avoid: ["Para evidencia con fuente: usa Stat.", "Más de 5 pares."],
    accessibility: ["Es un <dl>: cada etiqueta queda ligada a su valor."],
    related: ["stat", "avatar-group"],
  },
  {
    slug: "pull-quote",
    name: "PullQuote",
    group: "content",
    level: "átomo",
    summary: "Una línea sacada de la prosa para subrayarla. Sin atribución.",
    demo: <PullQuote>Nadie hace fila en la oscuridad: la espera se diseña.</PullQuote>,
    usage: "<PullQuote>Nobody stays in the dark.</PullQuote>",
    props: [
      {
        name: "children",
        type: "ReactNode",
        required: true,
        description: "La línea citada, que ya es parte del texto.",
      },
    ],
    use: ["En el blog, para la idea que el lector debe llevarse."],
    avoid: ["Testimonios o citas de terceros.", "Como decoración o relleno."],
    accessibility: [
      "Repite texto del artículo: no agrega información nueva que solo vea quien mira.",
    ],
    related: ["callout"],
  },
  {
    slug: "footnotes",
    name: "Footnotes",
    group: "content",
    level: "molécula",
    summary: "Notas al pie con referencias de ida y vuelta: [n] ↔ ↩.",
    demo: (
      <div className={styles.stack}>
        <p className={styles.body}>
          Una afirmación que necesita fuente.
          <FootnoteRef n={1} />
        </p>
        <Footnotes
          title="Notes"
          backLabel="Back to reference"
          items={[{ text: "La fuente, con autor y año." }]}
        />
      </div>
    ),
    usage: `Text<FootnoteRef n={1} />
<Footnotes title="Notes" backLabel="Back to reference" items={notes} />`,
    props: [
      {
        name: "items",
        type: "Array<{ text: ReactNode }>",
        required: true,
        description: "Notas en orden; la nota n se liga con <FootnoteRef n={n} />.",
      },
      {
        name: "title",
        type: "string",
        required: true,
        description: 'Etiqueta de la sección ("Notes").',
      },
      {
        name: "backLabel",
        type: "string",
        required: true,
        description: "Nombre accesible del regreso.",
      },
      {
        name: "credit",
        type: "ReactNode",
        description: "Ya no se usa: el crédito de edición va en el byline.",
      },
    ],
    use: ["Fuentes y aclaraciones del blog. En MDX los textos van en el front matter (notes)."],
    avoid: ["Para aclaraciones que el lector necesita ya: escríbelas en la prosa."],
    accessibility: [
      'La sección se etiqueta con su título; cada ↩ dice "<backLabel> n".',
      "La nota de destino se resalta y se desvanece; con movimiento reducido el resalte queda fijo.",
    ],
    related: ["pull-quote"],
  },
];
