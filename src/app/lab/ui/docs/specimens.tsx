import { blog } from "@/resources";
import {
  Accordion,
  ArticleCTA,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Callout,
  Card,
  Carousel,
  Chip,
  CodeBlock,
  Divider,
  FactSheet,
  FeaturedCase,
  Footer,
  Footnotes,
  Header,
  HeadingLink,
  IconButton,
  LaunchStrip,
  Link,
  List,
  ListItem,
  Media,
  NavItem,
  ProjectCard,
  Stat,
  Table,
  Tag,
  TeamCard,
  TocItem,
} from "@/ui";
import { SiClaude } from "@icons-pack/react-simple-icons";
import { ArrowRight, Github, Home, Linkedin, Mail, User, ViewGrid } from "iconoir-react";
import type { ReactNode } from "react";
import { ChipRemovable } from "../spec/ChipRemovable";
import type { Specimen } from "../spec/States";

// Ejemplos con los que se dibuja cada spec: el de anatomía (mismas props que el ejemplo de Figma)
// y el de la matriz de estados (fila de Figma → props del código). Copy de muestra, interno.

const helix = "/images/projects/helix";
const team = [
  { name: "Alan Cisneros", src: "/images/avatar.jpg" },
  { name: "Tenoch" },
  { name: "Clara" },
];
const nav = [
  { href: "/", label: "Home", icon: <Home /> },
  { href: "/about", label: "About", icon: <User /> },
  { href: "/work", label: "Work", icon: <ViewGrid /> },
];
const social = [
  { href: "https://github.com/AlanCisGon", label: "GitHub", icon: <Github /> },
  { href: "https://www.linkedin.com/in/alancisgon/", label: "LinkedIn", icon: <Linkedin /> },
  { href: "mailto:alancisgon@gmail.com", label: "Email", icon: <Mail /> },
];
const tableData = {
  headers: [
    { key: "metric", content: "Métrica" },
    { key: "result", content: "Resultado" },
    { key: "impact", content: "Impacto" },
  ],
  rows: [
    { metric: "Conversión web", result: "+2 pp", impact: "Duplicó la eficiencia" },
    { metric: "Conversión app", result: "+0.1 pp", impact: "Se sostuvo" },
  ],
};
const facts = [
  { label: "Client", value: "Coppel" },
  { label: "Role", value: "Design Lead" },
  { label: "Team", value: "3 UI · 2 UX · 1 UX writer" },
  { label: "Period", value: "Q4 2024 – Sep 2025" },
  { label: "Industry", value: "E-commerce" },
];
const wide = (node: ReactNode) => <div className="wide">{node}</div>;
const share = { href: "https://www.linkedin.com", label: "Share on LinkedIn" };

// El ejemplo de la spec de Figma (277:1164), tal cual: título, resumen, 3 tags y CTA.
const helixCard = (layout: "vertical" | "horizontal") => (
  <ProjectCard
    layout={layout}
    href="/work/project-helix"
    meta="E-commerce · Coppel · 2024"
    title="Project Helix: carrito y checkout"
    summary="Rediseño del fondo del embudo con implementación en Salesforce Commerce Cloud."
    tags={["Service Design", "Research", "UX Lead"]}
    cover={{ src: `${helix}/cart-cover.webp`, alt: "" }}
    cta="Ver caso de estudio"
  />
);

/** anatomy null = sin escenario de anatomía (specs del blog, solo texto). */
export type SpecSpecimens = { anatomy: ReactNode; specimen?: Specimen };

export const SPECIMENS: Record<string, SpecSpecimens> = {
  button: {
    anatomy: (
      <Button leadingIcon={<ArrowRight />} trailingIcon={<ArrowRight />}>
        Ver caso de estudio
      </Button>
    ),
    specimen: (row, state) => (
      <Button variant={row as "primary"} disabled={state === "Disabled"}>
        Ver caso de estudio
      </Button>
    ),
  },
  "icon-button": {
    anatomy: <IconButton icon={<Github />} label="GitHub" />,
    specimen: (row, state) => (
      <IconButton
        icon={<Github />}
        label="GitHub"
        variant={row as "ghost"}
        disabled={state === "Disabled"}
      />
    ),
  },
  link: {
    anatomy: (
      <Link href="/work" kind="standalone">
        Ver todos los proyectos
      </Link>
    ),
    specimen: (row) =>
      row === "inline" ? (
        <span>
          Texto con <Link href="/work">ver todos los proyectos</Link>.
        </span>
      ) : (
        <Link href="/work" kind="standalone">
          Ver todos los proyectos
        </Link>
      ),
  },
  "nav-item": {
    anatomy: <NavItem href="/" label="Inicio" icon={<Home />} selected />,
    specimen: (row) => (
      <NavItem href="/" label="Inicio" icon={<Home />} selected={row === "seleccionado"} />
    ),
  },
  chip: {
    anatomy: <ChipRemovable label="E-commerce" />,
    specimen: (row, state) => (
      <Chip label="E-commerce" selected={row === "seleccionado"} disabled={state === "Disabled"} />
    ),
  },
  tag: {
    anatomy: <Tag leadingIcon={<SiClaude title="" />}>Claude</Tag>,
    specimen: (row) => (
      <Tag leadingIcon={<SiClaude title="" />} size={row as "small"}>
        Claude
      </Tag>
    ),
  },
  badge: {
    anatomy: <Badge tone="info">Publicado</Badge>,
    specimen: (row) =>
      row === "sin ícono" ? (
        <Badge showIcon={false}>Publicado</Badge>
      ) : (
        <Badge tone={row as "info"}>Publicado</Badge>
      ),
  },
  avatar: {
    anatomy: <Avatar name="Alan Cisneros" size="xl" />,
    specimen: (row) => <Avatar name="Alan Cisneros" size={row as "s"} />,
  },
  "avatar-group": {
    anatomy: <AvatarGroup people={team} />,
    specimen: (row) => <AvatarGroup people={team.slice(0, Number(row))} />,
  },
  callout: {
    anatomy: wide(
      <Callout tone="info" title="Resultado">
        Texto de apoyo del aviso.
      </Callout>,
    ),
    specimen: (row) => (
      <Callout tone={row as "info"} title="Resultado">
        Texto de apoyo del aviso.
      </Callout>
    ),
  },
  divider: {
    anatomy: (
      <div className="wide">
        <Divider />
      </div>
    ),
    specimen: (row) =>
      row === "vertical" ? (
        <div className="vrule">
          <Divider orientation="vertical" />
        </div>
      ) : (
        <div className="fill">
          <Divider />
        </div>
      ),
  },
  list: {
    anatomy: wide(
      <List ordered>
        <ListItem>Investigar pronto, prototipar rápido y probar en pequeño.</ListItem>
      </List>,
    ),
    specimen: (row) => (
      <List ordered={row === "ordered"}>
        <ListItem>Investigar pronto.</ListItem>
      </List>
    ),
  },
  stat: {
    anatomy: (
      <div className="w240">
        <Stat
          value="+2"
          unit="pp"
          label="Web conversion"
          period="Jan 2026"
          source="Digital analytics"
          pendingLabel="Pending"
        />
      </div>
    ),
    specimen: (row) =>
      row === "pending" ? (
        <Stat unit="pp" label="Web conversion" pendingLabel="Métrica en validación" />
      ) : (
        <Stat
          value="+2"
          unit="pp"
          label="Web conversion"
          period="Jan 2026"
          source="Digital analytics"
          pendingLabel="Pending"
        />
      ),
  },
  "fact-sheet": {
    anatomy: wide(<FactSheet items={facts} />),
    specimen: () => <FactSheet items={facts} />,
  },
  table: {
    anatomy: wide(<Table caption="Métricas" data={tableData} />),
    specimen: () => <Table caption="Métricas" data={tableData} />,
  },
  "code-block": {
    anatomy: wide(<CodeBlock language="TSX" code={'import { Tag } from "@/ui";'} />),
    specimen: () => <CodeBlock language="TSX" code={"<Tag>Claude</Tag>"} />,
  },
  accordion: {
    anatomy: wide(
      <Accordion title="¿Cómo medimos el impacto?" defaultOpen>
        Con la conversión por canal antes y después.
      </Accordion>,
    ),
    specimen: (row) => (
      <Accordion title="¿Cómo medimos?" defaultOpen={row === "abierto"}>
        Antes y después.
      </Accordion>
    ),
  },
  media: {
    anatomy: wide(
      <Media
        src={`${helix}/checkout-flow.webp`}
        alt=""
        caption="Flujo de checkout rediseñado · Coppel, 2024"
      />,
    ),
    specimen: (row) => (
      <Media
        src={`${helix}/checkout-flow.webp`}
        alt=""
        ratio={row.split(" · ")[1] as "4:3"}
        caption="Coppel, 2024"
      />
    ),
  },
  carousel: {
    anatomy: wide(
      <Carousel
        label="Helix"
        images={[
          { src: `${helix}/cart-cover.webp`, alt: "" },
          { src: `${helix}/checkout-flow.webp`, alt: "" },
        ]}
      />,
    ),
  },
  "table-of-contents": {
    anatomy: (
      <div className="w240">
        <TocItem href="#" number="01" label="Contexto" active />
        <TocItem href="#" number="02" label="Problema" />
      </div>
    ),
    specimen: () => <TocItem href="#" number="02" label="Problema" />,
  },
  "heading-link": {
    anatomy: (
      <div data-sds-state="hover">
        <HeadingLink id="anatomy-heading">Resultados</HeadingLink>
      </div>
    ),
    specimen: (_, state) => <HeadingLink id={`state-${state}`}>Resultados</HeadingLink>,
  },
  card: {
    anatomy: (
      <div className="w360">
        <Card href="/about" eyebrow="01 · Principio" title="Entiendo el problema">
          Investigo pronto y pruebo en pequeño.
        </Card>
      </div>
    ),
    specimen: () => (
      <Card href="/about" eyebrow="01 · Principio" title="Entiendo el problema">
        Investigo pronto.
      </Card>
    ),
  },
  "project-card": {
    anatomy: <div className="w400">{helixCard("vertical")}</div>,
    specimen: (row) => helixCard(row as "vertical"),
  },
  header: {
    anatomy: wide(<Header items={nav} location="Culiacán" timeZone="America/Mazatlan" />),
  },
  footer: {
    anatomy: wide(<Footer signature="© 2026 Alan Cisneros · Culiacán, México" social={social} />),
  },
  "team-card": {
    anatomy: wide(
      // biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA
      <TeamCard name="Alan" role="Owns the project, leads design" avatarSrc="/images/avatar.jpg">
        Defines the brand, the tokens and the rules.
      </TeamCard>,
    ),
    specimen: (row) => (
      // biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA
      <TeamCard name="Alan" role="Leads design" initials="AC" layout={row as "vertical"}>
        Defines the brand.
      </TeamCard>
    ),
  },
  "featured-case": {
    anatomy: (
      <div className="w1080">
        {/* biome-ignore lint/a11y/useValidAriaRole: `role` es el puesto de la persona (prop del SDS), no un rol ARIA */}
        <FeaturedCase
          href="/work/project-helix"
          meta="Case study · Somara Studio"
          badge="Featured work"
          proof="Three days from template fork to a design system of its own."
          title="How I direct an AI design team"
          role="I set the brand, the rules and the final approval."
          team={team}
          cta="Read how we built it"
          cover={{ src: `${helix}/cart-cover.webp`, alt: "" }}
        />
      </div>
    ),
  },
  "launch-strip": {
    anatomy: wide(
      <LaunchStrip
        href="/blog"
        lead="A field note on design and load time:"
        title="Nobody stays in the dark"
      />,
    ),
    specimen: () => (
      <LaunchStrip
        href="/blog"
        lead="A field note on design and load time:"
        title="Nobody stays in the dark"
      />
    ),
  },
  footnotes: {
    anatomy: null,
    // El bloque de notas: el ↩ es el backlink que nombra la spec (no la llamada ¹ de la prosa).
    specimen: () => (
      <Footnotes
        title="Notes"
        backLabel="Back to reference"
        items={[{ text: "La fuente, con autor y año." }]}
      />
    ),
  },
  "article-cta": {
    anatomy: null,
    // Copy real del sitio (blog.cta en content.tsx), no de muestra.
    specimen: (row) =>
      row === "next" ? (
        <ArticleCTA
          variant="next"
          heading={blog.cta.next.heading}
          href="/blog"
          label="Nobody stays in the dark"
        />
      ) : (
        <ArticleCTA
          variant="contact"
          heading={blog.cta.contact.heading}
          body={blog.cta.contact.body}
          href="mailto:alancisgon@gmail.com"
          label={blog.cta.contact.label}
          share={share}
        />
      ),
  },
  "card-wide": {
    anatomy: null,
    specimen: (row) => (
      <Card
        href="/blog"
        layout={row as "wide"}
        eyebrow="Field note"
        title="Nobody stays in the dark"
        meta="Oct 14, 2026 · 6 min read"
        cta="Read the note"
      >
        Load time is a design decision.
      </Card>
    ),
  },
};
