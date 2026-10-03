import { ArrowRight, Github, Home, Linkedin, Mail, User, ViewGrid } from "iconoir-react";
import type { Metadata } from "next";
import { SiClaude, SiFigma } from "@icons-pack/react-simple-icons";
import {
  Accordion,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Callout,
  Card,
  Carousel,
  CodeBlock,
  Divider,
  Footer,
  Header,
  HeadingLink,
  IconButton,
  Link,
  List,
  ListItem,
  Media,
  NavItem,
  ProjectCard,
  Table,
  TableOfContents,
  Tag,
} from "@/ui";
import { ChipDemo } from "./ChipDemo";
import styles from "./page.module.css";

// Private component catalog (behind /lab Basic Auth). Compare against Figma: PDS · Portfolio Design System.
export const metadata: Metadata = { title: "Lab · UI", robots: { index: false, follow: false } };

const nav = [
  { href: "/", label: "Inicio", icon: <Home /> },
  { href: "/about", label: "Sobre mí", icon: <User /> },
  { href: "/lab/ui", label: "Trabajo", icon: <ViewGrid /> },
];

const helix = "/images/projects/helix";

export default function UiCatalog() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>LAB · DESIGN SYSTEM</p>
        <h1 className={styles.title}>Catálogo de componentes</h1>
        <p className={styles.lead}>Implementación en código de los grupos 02a–02e de Figma. Pasa el cursor y usa Tab para ver los estados.</p>
      </header>

      <section className={styles.section} id="actions">
        <h2 className={styles.h2}>02a · Actions</h2>
        {(["primary", "secondary", "ghost"] as const).map((v) => (
          <div className={styles.row} key={v}>
            <Button variant={v}>Ver caso de estudio</Button>
            <Button variant={v} trailingIcon={<ArrowRight />}>
              Con ícono
            </Button>
            <Button variant={v} size="s">
              Small
            </Button>
            <Button variant={v} disabled>
              Deshabilitado
            </Button>
          </div>
        ))}
        <div className={styles.row}>
          <IconButton icon={<Github />} label="GitHub" />
          <IconButton icon={<Github />} label="GitHub" variant="ghost" />
          <IconButton icon={<Github />} label="GitHub" size="s" />
          <IconButton icon={<Github />} label="GitHub" disabled />
        </div>
        <div className={styles.row}>
          <p className={styles.body}>
            Un párrafo con un <Link href="/about">enlace en el texto</Link> y otro <Link href="https://figma.com">externo</Link>.
          </p>
          <Link href="/work" kind="standalone">
            Ver todos los proyectos
          </Link>
        </div>
        <div className={styles.row}>
          <NavItem href="/" label="Inicio" icon={<Home />} selected />
          <NavItem href="/about" label="Sobre mí" icon={<User />} />
          <NavItem href="/work" label="Trabajo" icon={<ViewGrid />} showLabel={false} />
        </div>
        <div className={styles.stack}>
          <ChipDemo />
        </div>
      </section>

      <section className={styles.section} id="content">
        <h2 className={styles.h2}>02b · Content</h2>
        <div className={styles.row}>
          <Tag leadingIcon={<SiClaude title="" />}>Claude</Tag>
          <Tag leadingIcon={<SiFigma title="" />}>Figma</Tag>
          <Tag size="small">Service Design</Tag>
        </div>
        <div className={styles.row}>
          {(["neutral", "info", "success", "warning", "danger"] as const).map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
        </div>
        <div className={styles.row}>
          <Avatar name="Alan Cisneros" size="s" />
          <Avatar name="Alan Cisneros" size="m" />
          <Avatar name="Alan Cisneros" size="l" src="/images/avatar.jpg" />
          <AvatarGroup people={[{ name: "Alan Cisneros" }, { name: "Juana Martínez" }, { name: "Luis Ramos" }, { name: "Ana Pérez" }]} />
        </div>
        <Divider />
        <div className={styles.grid}>
          {(["info", "success", "warning", "danger", "neutral"] as const).map((t) => (
            <Callout key={t} tone={t} title={{ info: "Contexto", success: "Resultado", warning: "Atención", danger: "Riesgo", neutral: "Nota" }[t]}>
              Texto de apoyo del aviso. Una idea por callout; la evidencia antes que los adjetivos.
            </Callout>
          ))}
        </div>
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
      </section>

      <section className={styles.section} id="data">
        <h2 className={styles.h2}>02c · Data &amp; Media</h2>
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
              { metric: "Ticket promedio", result: "+25 %", impact: "Nuevos servicios" },
            ],
          }}
        />
        <CodeBlock language="TSX" code={'import { Tag } from "@/ui";\n\n<Tag leadingIcon={<SiClaude />}>Claude</Tag>'} />
        <div className={styles.stack}>
          <Accordion title="¿Cómo medimos el impacto?">Con la conversión por canal antes y después del rediseño, en el mismo periodo del año.</Accordion>
          <Accordion title="Abierto por defecto" defaultOpen>
            El panel se expande desde su lugar y el chevron rota 180°.
          </Accordion>
        </div>
        <div className={styles.grid}>
          <Media src={`${helix}/checkout-flow.webp`} alt="Flujo de checkout rediseñado" caption="Flujo de checkout rediseñado" />
          <Media ratio="4:3" caption="Sin imagen: placeholder tonal" />
          <Media ratio="1:1" src={`${helix}/unified-cart.webp`} alt="Carrito unificado" caption="1:1" />
        </div>
        <Carousel
          label="Project Helix"
          images={[
            { src: `${helix}/cart-cover.webp`, alt: "Portada del carrito" },
            { src: `${helix}/checkout-flow.webp`, alt: "Flujo de checkout" },
            { src: `${helix}/coppel-credit.webp`, alt: "Crédito Coppel" },
            { src: `${helix}/unified-cart.webp`, alt: "Carrito unificado" },
          ]}
        />
      </section>

      <section className={styles.section} id="navigation">
        <h2 className={styles.h2}>02d · Navigation</h2>
        <div className={styles.split}>
          <TableOfContents
            entries={[
              { id: "actions", label: "Actions" },
              { id: "content", label: "Content" },
              { id: "data", label: "Data & Media" },
              { id: "navigation", label: "Navigation" },
              { id: "site", label: "Cards & Site" },
            ]}
          />
          <HeadingLink id="resultados">Resultados</HeadingLink>
        </div>
      </section>

      <section className={styles.section} id="site">
        <h2 className={styles.h2}>02e · Cards &amp; Site</h2>
        <div className={styles.grid}>
          <Card eyebrow="01 · Principio" title="Entiendo el problema antes de proponer soluciones">
            Investigo pronto, prototipo rápido y pruebo en pequeño.
          </Card>
          <Card href="/about" eyebrow="02 · Enlace" title="Toda la tarjeta es un enlace">
            Hover: el bloque completo sube a bg-elevated.
          </Card>
        </div>
        <div className={styles.grid}>
          <ProjectCard
            href="/work/project-helix"
            meta="E-commerce · Coppel · 2024"
            title="Project Helix: carrito y checkout"
            summary="Rediseño del fondo del embudo con implementación en Salesforce Commerce Cloud."
            tags={["Service Design", "Research", "UX Lead"]}
            cover={{ src: `${helix}/cart-cover.webp`, alt: "" }}
          />
          <ProjectCard href="/work/movistar-mx" meta="Telecom · Movistar · 2023" title="Movistar México" summary="Sin portada: placeholder tonal 16:9." tags={["App"]} />
        </div>
        <ProjectCard
          layout="horizontal"
          href="/work/project-helix"
          meta="E-commerce · Coppel · 2024"
          title="Destacado horizontal"
          summary="En mobile siempre vertical."
          tags={["Service Design"]}
          cover={{ src: `${helix}/inner-cover.webp`, alt: "" }}
        />
        <div className={styles.frame}>
          <Header items={nav} location="América/Mazatlán" timeZone="America/Mazatlan" />
        </div>
        <div className={styles.frame}>
          <Footer
            signature="© 2026 Alan Cisneros · Culiacán, México"
            colophonHref="/lab"
            social={[
              { href: "https://github.com/AlanCisGon", label: "GitHub", icon: <Github /> },
              { href: "https://www.linkedin.com/in/alancisgon/", label: "LinkedIn", icon: <Linkedin /> },
              { href: "mailto:alancisgon@gmail.com", label: "Correo", icon: <Mail /> },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
