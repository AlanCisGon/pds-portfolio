import { blog } from "@/resources";
import {
  ArticleCTA,
  Card,
  FeaturedCase,
  Footer,
  Header,
  LaunchStrip,
  ProjectCard,
  TeamCard,
  VisuallyHidden,
  WritingSection,
} from "@/sds";
import { Github, Home, Linkedin, Mail, User, ViewGrid } from "iconoir-react";
import styles from "../page.module.css";
import type { ComponentDoc } from "./types";

const helix = "/images/projects/helix";

const articles = [
  {
    href: "/blog",
    eyebrow: "Field note",
    title: "Nobody stays in the dark",
    dek: "Load time is a design decision.",
    meta: "Oct 14, 2026 · 6 min read",
  },
  {
    href: "/blog",
    eyebrow: "Field note",
    title: "Segunda nota de ejemplo",
    dek: "Con dos, la sección pasa a cuadrícula.",
    meta: "Oct 20, 2026 · 4 min read",
  },
];

export const site: ComponentDoc[] = [
  {
    slug: "card",
    name: "Card",
    group: "site",
    level: "molécula",
    summary:
      "Tile del bento: se distingue por tono (bg-surface), sin borde ni sombra. También es la tarjeta de artículo.",
    demo: (
      <div className={styles.stack}>
        <div className={styles.grid}>
          <Card eyebrow="01 · Principio" title="Entiendo el problema antes de proponer soluciones">
            Investigo pronto, prototipo rápido y pruebo en pequeño.
          </Card>
          <Card href="/about" eyebrow="02 · Enlace" title="Toda la tarjeta es un enlace">
            Hover: el bloque completo sube a bg-elevated.
          </Card>
        </div>
        <Card
          href="/blog"
          layout="wide"
          eyebrow="Field note"
          title="Nobody stays in the dark"
          meta="Oct 14, 2026 · 6 min read"
          cta="Read the note"
        >
          Load time is a design decision.
        </Card>
      </div>
    ),
    usage: `<Card eyebrow="01 · Principle" title="…">Body</Card>
<Card href="/blog/x" layout="wide" title="…" meta="…" cta="Read the note" />`,
    props: [
      { name: "title", type: "string", required: true, figma: "Title", description: "Título." },
      {
        name: "eyebrow",
        type: "string",
        figma: "Eyebrow",
        description: "Numeración o metadato en Chivo Mono.",
      },
      { name: "children", type: "ReactNode", figma: "Body", description: "Cuerpo." },
      {
        name: "href",
        type: "string",
        figma: "Kind=link",
        description: "Toda la tarjeta es un solo enlace.",
      },
      {
        name: "layout",
        type: '"wide" | "grid"',
        description: "Tarjeta de artículo: wide sola en su fila; grid una de 2–3.",
      },
      { name: "meta", type: "string", description: "Línea de fecha y lectura." },
      {
        name: "cta",
        type: "string",
        description: "CTA de texto al pie; la tarjeta sigue siendo un solo enlace.",
      },
    ],
    use: ["Principios y bloques del bento.", "Artículos del blog (layout)."],
    avoid: [
      "Casos de estudio con portada: usa ProjectCard.",
      "Enlaces anidados dentro de una tarjeta con href.",
    ],
    accessibility: ["Con href hay un solo enlace: no hay destinos duplicados para el teclado."],
    related: ["project-card", "writing-section"],
  },
  {
    slug: "project-card",
    name: "ProjectCard",
    group: "site",
    level: "molécula",
    summary: "Tarjeta de caso de estudio. Toda la tarjeta es un enlace; el CTA es su señal visual.",
    demo: (
      <div className={styles.stack}>
        <div className={styles.grid}>
          <ProjectCard
            href="/work/project-helix"
            meta="E-commerce · Coppel · 2024"
            title="Project Helix: carrito y checkout"
            summary="Rediseño del fondo del embudo."
            tags={["Service Design", "Research"]}
            cover={{ src: `${helix}/cart-cover.webp`, alt: "" }}
          />
          <ProjectCard
            href="/work/movistar-mx"
            meta="Telecom · Movistar · 2019"
            title="Movistar México"
            summary="Sin portada: placeholder tonal 16:9."
            tags={["App"]}
          />
        </div>
        <ProjectCard
          layout="horizontal"
          href="/work/project-helix"
          meta="E-commerce · Coppel · 2024"
          title="Destacado horizontal"
          summary="En móvil siempre vertical."
          cover={{ src: `${helix}/inner-cover.webp`, alt: "" }}
        />
      </div>
    ),
    usage: `<ProjectCard href="/work/x" meta="Industry · Client · Year" title="…" tags={["Research"]} cover={{ src, alt: "" }} />`,
    props: [
      { name: "href", type: "string", required: true, figma: "Body", description: "El caso." },
      {
        name: "meta",
        type: "string",
        required: true,
        figma: "Body",
        description: "Industria · cliente · año, en Chivo Mono.",
      },
      {
        name: "title",
        type: "string",
        required: true,
        figma: "Body",
        description: "Título del caso.",
      },
      { name: "summary", type: "string", figma: "Body", description: "Una línea." },
      {
        name: "tags",
        type: "string[]",
        figma: "Body",
        description: "Tags informativos, sin íconos.",
      },
      {
        name: "cover",
        type: "{ src: string; alt: string }",
        figma: "Cover",
        description: "Portada; sin ella, placeholder tonal.",
      },
      {
        name: "layout",
        type: '"vertical" | "horizontal"',
        default: '"vertical"',
        figma: "Layout",
        description: "horizontal = destacado en escritorio.",
      },
      { name: "priority", type: "boolean", description: "Primera tarjeta de la página (LCP)." },
      { name: "cta", type: "string", figma: "Body", description: "Texto del CTA." },
    ],
    use: ["Lista de trabajo y casos relacionados."],
    avoid: ["El caso destacado de Home: usa FeaturedCase."],
    accessibility: [
      "Un solo enlace por tarjeta; la portada reserva su proporción (sin layout shift).",
    ],
    related: ["featured-case", "card", "tag"],
  },
  {
    slug: "featured-case",
    name: "FeaturedCase",
    group: "site",
    level: "organismo",
    summary: "Caso destacado de Home: la evidencia encabeza el bloque, en Voice.",
    demo: (
      // biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA
      <FeaturedCase
        href="/work/project-helix"
        meta="Case study · Coppel"
        badge="In progress"
        proof="+2 pp de conversión web"
        title="Project Helix"
        role="Design Lead"
        team={[{ name: "Alan Cisneros", src: "/images/avatar.jpg" }, { name: "Fer" }]}
        cta="Read the case"
        cover={{ src: `${helix}/cart-cover.webp`, alt: "" }}
      />
    ),
    usage: `<FeaturedCase href="/work/x" meta="…" proof="…" title="…" role="…" cta="Read the case" />`,
    props: [
      { name: "href", type: "string", required: true, description: "El caso." },
      { name: "meta", type: "string", required: true, description: "Línea de contexto." },
      {
        name: "proof",
        type: "string",
        required: true,
        description: "La evidencia, en Voice, encabeza el bloque.",
      },
      { name: "title", type: "string", required: true, description: "Título." },
      { name: "role", type: "string", required: true, description: "Rol de Alan." },
      { name: "cta", type: "string", required: true, description: "Texto del enlace." },
      { name: "badge", type: "string", description: "Estatus estático (Badge neutral)." },
      { name: "team", type: "Array<{ name: string; src?: string }>", description: "AvatarGroup." },
      { name: "cover", type: "{ src: string; alt: string }", description: "Portada." },
      {
        name: "divider",
        type: "boolean",
        default: "true",
        description: "Se apaga cuando una LaunchStrip va justo arriba.",
      },
      {
        name: "priority",
        type: "boolean",
        default: "false",
        description: "Arriba del fold (LCP).",
      },
    ],
    use: ["Uno solo, en Home."],
    avoid: ["Listas de casos: usa ProjectCard."],
    accessibility: ["<section> etiquetada por su título."],
    related: ["project-card", "launch-strip", "badge"],
  },
  {
    slug: "team-card",
    name: "TeamCard",
    group: "site",
    level: "molécula",
    figmaNode: "83:152",
    summary: "Tarjeta estática de un integrante: avatar, nombre, rol y descripción.",
    demo: (
      <div className={styles.grid}>
        {/* biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA */}
        <TeamCard name="Alan Cisneros" role="Design Lead" avatarSrc="/images/avatar.jpg">
          Dirige el equipo y decide.
        </TeamCard>
        {/* biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA */}
        <TeamCard name="Tenoch" role="Orquestador" initials="TE" layout="vertical">
          Programa el sitio e integra al equipo.
        </TeamCard>
      </div>
    ),
    usage: `<TeamCard name="…" role="…" avatarSrc="…">Description</TeamCard>`,
    props: [
      { name: "name", type: "string", required: true, figma: "Name", description: "Nombre." },
      {
        name: "role",
        type: "string",
        required: true,
        figma: "Role",
        description: "Texto plano, nunca Cerezo.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Description",
        description: "Descripción.",
      },
      {
        name: "avatarSrc",
        type: "string",
        description: "Foto o ilustración; sin ella, iniciales.",
      },
      { name: "initials", type: "string", description: "Iniciales." },
      {
        name: "layout",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        figma: "Layout",
        description: "Avatar al lado o arriba.",
      },
    ],
    use: ["Equipos de un caso, con el patrón TeamGrid desde MDX."],
    avoid: ["Solo caras sin roles: usa AvatarGroup."],
    accessibility: ["El nombre es visible, así que el avatar es decorativo."],
    related: ["avatar", "avatar-group"],
  },
  {
    slug: "launch-strip",
    name: "LaunchStrip",
    group: "site",
    level: "molécula",
    summary: "Una línea, un enlace, entre bordes sutiles. Anuncia lo nuevo sin gritar.",
    demo: (
      <LaunchStrip
        href="/blog"
        lead="A field note on design and load time:"
        title="Nobody stays in the dark"
      />
    ),
    usage: `<LaunchStrip href="/blog/x" lead="A field note on…:" title="…" />`,
    props: [
      { name: "href", type: "string", required: true, description: "Destino." },
      { name: "lead", type: "string", required: true, description: "Entrada antes del título." },
      {
        name: "title",
        type: "string",
        required: true,
        description: "Título enlazado, siempre subrayado.",
      },
    ],
    use: ["En Home, mientras haya un artículo nuevo. Una a la vez."],
    avoid: ["Badges, contadores o botón de cerrar: no los lleva.", "Falsa urgencia."],
    accessibility: [
      "Subrayado siempre (WCAG 1.4.1).",
      "Con movimiento reducido, la flecha no avanza: solo cambia el color.",
    ],
    related: ["featured-case"],
  },
  {
    slug: "article-cta",
    name: "ArticleCTA",
    group: "site",
    level: "molécula",
    summary: "Cierre de un artículo: contacto mientras hay uno, siguiente nota desde dos.",
    demo: (
      <ArticleCTA
        variant="contact"
        heading="¿Piensas en esto para tu propio producto?"
        body="Me gustaría saber cómo lo resuelves."
        href="mailto:alancisgon@gmail.com"
        label="Escríbeme"
        share={{ href: "https://www.linkedin.com", label: "Compartir en LinkedIn" }}
      />
    ),
    usage: `<ArticleCTA variant="next" heading="Next note" href="/blog/y" label="…" share={{ href, label }} />`,
    props: [
      {
        name: "variant",
        type: '"contact" | "next"',
        required: true,
        description: "contact con un artículo; next desde dos.",
      },
      { name: "heading", type: "string", required: true, description: "Heading S." },
      { name: "body", type: "string", description: "Línea bajo el encabezado." },
      {
        name: "href",
        type: "string",
        required: true,
        description: "mailto o el siguiente artículo.",
      },
      { name: "label", type: "string", required: true, description: "Texto del enlace principal." },
      {
        name: "share",
        type: "{ href: string; label: string }",
        required: true,
        description: "Compartir en LinkedIn, en secundario.",
      },
    ],
    use: ["Al final de cada artículo."],
    avoid: ["Formularios: el contacto es un correo."],
    accessibility: [
      "Se ve ya asentado sin JS, con movimiento reducido o al recibir el foco.",
      "La sección se etiqueta con heading.",
    ],
    related: ["writing-section"],
  },
  {
    slug: "writing-section",
    name: "WritingSection",
    group: "site",
    level: "organismo",
    summary:
      'Sección de textos: 1 = tarjeta wide; 2–3 = cuadrícula; más = las 3 recientes y "All writing".',
    demo: (
      <WritingSection
        title="Writing"
        subtitle="Field notes on design."
        articles={articles}
        cta="Read the note"
        all={{ href: "/blog", label: "All writing" }}
      />
    ),
    usage: `<WritingSection title="Writing" subtitle="…" articles={notes} cta="Read the note" all={{ href: "/blog", label: "All writing" }} />`,
    props: [
      { name: "title", type: "string", required: true, description: "Encabezado." },
      { name: "subtitle", type: "string", required: true, description: "Línea de apoyo." },
      {
        name: "articles",
        type: "WritingArticle[]",
        required: true,
        description: "Del más nuevo al más viejo.",
      },
      { name: "cta", type: "string", required: true, description: "CTA de cada tarjeta." },
      {
        name: "all",
        type: "{ href: string; label: string }",
        required: true,
        description: "Aparece desde dos artículos.",
      },
      {
        name: "showAll",
        type: "boolean",
        description: 'Índice: todas las notas y sin "All writing".',
      },
      {
        name: "headingLevel",
        type: "1 | 2",
        default: "2",
        description: "h2 en Home, h1 en /blog.",
      },
    ],
    use: ["Home y /blog."],
    avoid: ["Mezclar casos con artículos: el blog es solo teoría de la disciplina."],
    accessibility: ["<section> etiquetada por su título; un enlace por tarjeta."],
    related: ["card", "article-cta"],
  },
  {
    slug: "header",
    name: "Header",
    group: "site",
    level: "organismo",
    summary: "Navegación en píldora, centrada; ubicación y reloj opcionales a los lados.",
    demo: (
      <div className={styles.frame}>
        <Header
          items={[
            { href: "/", label: "Inicio", icon: <Home /> },
            { href: "/about", label: "Sobre mí", icon: <User /> },
            { href: "/lab/ui", label: "Trabajo", icon: <ViewGrid /> },
          ]}
          location="América/Mazatlán"
          timeZone="America/Mazatlan"
        />
      </div>
    ),
    usage: `<Header items={nav} revealAfterFoldOn={["/"]} />`,
    props: [
      {
        name: "items",
        type: "Array<{ href; label; icon }>",
        required: true,
        description: "NavItems.",
      },
      {
        name: "location",
        type: "string",
        description: "A la izquierda en escritorio. El sitio lo deja vacío.",
      },
      {
        name: "timeZone",
        type: "string",
        description: "Zona IANA para el reloj. Omitir = sin reloj.",
      },
      {
        name: "revealAfterFoldOn",
        type: "string[]",
        description: "Rutas con hero a sangre: oculto hasta pasar el 85 % del viewport.",
      },
    ],
    use: ["Una vez, en el layout del sitio."],
    avoid: ["Ocultarlo según la dirección del scroll: está fijo arriba."],
    accessibility: [
      '<nav aria-label="Main">.',
      ":focus-within siempre lo muestra; oculto sigue en el árbol a propósito.",
      "Con movimiento reducido, sin transición.",
    ],
    related: ["nav-item", "footer"],
  },
  {
    slug: "footer",
    name: "Footer",
    group: "site",
    level: "organismo",
    summary: "Firma y colofón, con redes. La única línea estructural del sitio (1 px arriba).",
    demo: (
      <div className={styles.frame}>
        <Footer
          signature="© 2026 Alan Cisneros · Culiacán, México"
          colophonHref="/lab"
          social={[
            { href: "https://github.com/AlanCisGon", label: "GitHub", icon: <Github /> },
            {
              href: "https://www.linkedin.com/in/alancisgon/",
              label: "LinkedIn",
              icon: <Linkedin />,
            },
            { href: "mailto:alancisgon@gmail.com", label: "Email", icon: <Mail /> },
          ]}
        />
      </div>
    ),
    usage: `<Footer signature="© 2026 Alan Cisneros" social={links} />`,
    props: [
      {
        name: "signature",
        type: "ReactNode",
        required: true,
        description: "Firma; puede llevar enlaces.",
      },
      {
        name: "colophonHref",
        type: "string",
        description: "Página de colofón; se omite hasta que exista.",
      },
      {
        name: "social",
        type: "Array<{ href; label; icon }>",
        required: true,
        description: "IconButton ghost.",
      },
    ],
    use: ["Una vez, en el layout."],
    avoid: ["Más líneas estructurales en el sitio."],
    accessibility: ["Cada red tiene label; los externos abren en otra pestaña."],
    related: ["header", "icon-button"],
  },
];

export const utility: ComponentDoc[] = [
  {
    slug: "visually-hidden",
    name: "VisuallyHidden",
    group: "utility",
    level: "utilidad",
    summary: 'Texto solo para tecnologías de asistencia (p. ej. "opens in a new tab").',
    demo: (
      <p className={styles.body}>
        Hay texto oculto aquí:<VisuallyHidden> lo lee el lector de pantalla</VisuallyHidden>.
      </p>
    ),
    usage: "<VisuallyHidden>opens in a new tab</VisuallyHidden>",
    props: [{ name: "children", type: "ReactNode", required: true, description: "El texto." }],
    use: ["Contexto que la vista ya da y el lector de pantalla no."],
    avoid: ["Esconder contenido para SEO.", "Reemplazar un label visible que todos necesitan."],
    accessibility: ["Sigue en el árbol de accesibilidad; no se ve."],
    related: ["link"],
  },
];
