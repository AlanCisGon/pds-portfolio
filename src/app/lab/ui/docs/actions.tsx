import { Button, IconButton, Link, NavItem } from "@/sds";
import { ArrowRight, Github, Home, User, ViewGrid } from "iconoir-react";
import { ChipDemo } from "../ChipDemo";
import styles from "../page.module.css";
import { SearchFieldDemo } from "../spec/SearchFieldDemo";
import type { ComponentDoc } from "./types";

export const actions: ComponentDoc[] = [
  {
    slug: "button",
    name: "Button",
    group: "actions",
    level: "átomo",
    summary: "Acción principal o secundaria. Es un <button>, o un enlace cuando recibe href.",
    demo: (
      <div className={styles.stack}>
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
      </div>
    ),
    usage: `<Button variant="primary" trailingIcon={<ArrowRight />}>View the case</Button>
<Button href="/work" variant="secondary">All work</Button>`,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "ghost"',
        default: '"primary"',
        figma: "Variant",
        description: "primary va en Cerezo: una sola acción principal por vista.",
      },
      {
        name: "size",
        type: '"m" | "s"',
        default: '"m"',
        figma: "Size",
        description: "m 40 px, s 32 px.",
      },
      {
        name: "leadingIcon",
        type: "ReactNode",
        figma: "LeadingIcon",
        description: "Ícono de Iconoir antes del texto. Omitir lo oculta.",
      },
      {
        name: "trailingIcon",
        type: "ReactNode",
        figma: "TrailingIcon",
        description: "Ícono después del texto.",
      },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Label",
        description: "Texto del botón: un verbo concreto.",
      },
      {
        name: "href",
        type: "string",
        description:
          "Lo vuelve enlace (next/link). Con disabled se pinta como <span aria-disabled>.",
      },
      {
        name: "disabled",
        type: "boolean",
        description: "Sin color de acción (ver Disabled en el doc del sistema).",
      },
    ],
    use: [
      "Para la acción que cierra una sección: ver un caso, escribir un correo.",
      "primary una sola vez por vista; las demás acciones van en secondary o ghost.",
      "Con href cuando la acción lleva a otra página pero debe verse como botón.",
    ],
    avoid: [
      "Dentro de un párrafo: usa Link inline.",
      "Para un ícono sin texto: usa IconButton.",
      "Para filtrar o alternar: usa Chip.",
    ],
    accessibility: [
      'Por omisión es type="button" para no enviar formularios por accidente.',
      "Los íconos son aria-hidden; el nombre accesible es el texto.",
      "Foco visible: outline de 2 px con --color-focus-ring y offset de 2 px.",
    ],
    related: ["icon-button", "link", "chip"],
  },
  {
    slug: "icon-button",
    name: "IconButton",
    group: "actions",
    level: "átomo",
    summary: "Acción solo con ícono: redes sociales, carrusel, copiar, cerrar.",
    demo: (
      <div className={styles.row}>
        <IconButton icon={<Github />} label="GitHub" />
        <IconButton icon={<Github />} label="GitHub" variant="ghost" />
        <IconButton icon={<Github />} label="GitHub" size="s" />
        <IconButton icon={<Github />} label="GitHub" disabled />
      </div>
    ),
    usage: `<IconButton icon={<Github />} label="GitHub" href="https://github.com/AlanCisGon" />`,
    props: [
      {
        name: "icon",
        type: "ReactNode",
        required: true,
        figma: "Icon",
        description: "Un elemento de Iconoir.",
      },
      {
        name: "label",
        type: "string",
        required: true,
        description: "Nombre accesible y tooltip. Obligatorio: no hay texto visible.",
      },
      {
        name: "variant",
        type: '"secondary" | "ghost"',
        default: '"secondary"',
        figma: "Variant",
        description: "No existe primary: un ícono no es la acción principal.",
      },
      {
        name: "size",
        type: '"m" | "s"',
        default: '"m"',
        figma: "Size",
        description: "40 o 32 px; los dos superan el objetivo de 24×24.",
      },
      {
        name: "href",
        type: "string",
        description: "Lo vuelve enlace. http(s) abre en otra pestaña; mailto no.",
      },
      {
        name: "external",
        type: "boolean",
        description: "Fuerza o apaga la pestaña nueva; por omisión se deduce del href.",
      },
    ],
    use: [
      "Para acciones universales que el ícono nombra solo: redes, copiar, cerrar, anterior y siguiente.",
    ],
    avoid: [
      "Si el ícono necesita explicación, usa Button con texto.",
      "Para la acción principal de la vista.",
    ],
    accessibility: [
      "label se vuelve aria-label y title.",
      "El área táctil nunca baja de 24×24 px (WCAG 2.5.8).",
    ],
    related: ["button"],
  },
  {
    slug: "link",
    name: "Link",
    group: "actions",
    level: "átomo",
    summary:
      "Enlace de navegación en Cerezo, dentro del texto (inline) o suelto con ícono (standalone).",
    demo: (
      <div className={styles.stack}>
        <p className={styles.body}>
          Un párrafo con un <Link href="/about">enlace en el texto</Link> y otro{" "}
          <Link href="https://figma.com">externo</Link>.
        </p>
        <div className={styles.row}>
          <Link href="/work" kind="standalone">
            Ver todos los proyectos
          </Link>
          <Link href="/blog" kind="standalone" back>
            Todos los textos
          </Link>
        </div>
      </div>
    ),
    usage: `<Link href="/about">about me</Link>
<Link href="/work" kind="standalone">All work</Link>
<Link href="/blog" kind="standalone" back>All writing</Link>`,
    props: [
      { name: "href", type: "string", required: true, description: "Destino." },
      {
        name: "children",
        type: "ReactNode",
        required: true,
        figma: "Label",
        description: "Texto del enlace: dice adónde lleva.",
      },
      {
        name: "kind",
        type: '"inline" | "standalone"',
        default: '"inline"',
        figma: "Kind",
        description: "inline dentro de un párrafo; standalone suelto con ícono al final.",
      },
      {
        name: "external",
        type: "boolean",
        description:
          "Pestaña nueva con ícono OpenNewWindow y aviso. Por omisión, true para http(s).",
      },
      {
        name: "trailingIcon",
        type: "ReactNode",
        figma: "TrailingIcon",
        description: "Solo standalone. Por omisión ArrowRight, u OpenNewWindow si es externo.",
      },
      {
        name: "back",
        type: "boolean",
        description: "Solo standalone: la flecha va antes de la etiqueta y no hay ícono final.",
      },
    ],
    use: [
      "inline para citar o remitir dentro de la prosa.",
      'standalone al final de una sección ("All work") o para volver (back).',
    ],
    avoid: [
      "Sobre --color-bg-elevated: el Cerezo baja a 4.58:1.",
      "Para una acción que cambia algo en la página: usa Button.",
    ],
    accessibility: [
      "inline siempre va subrayado: el Cerezo contra el texto da ~2.8:1, menos de los 3:1 de WCAG 1.4.1.",
      'Los externos anuncian "opens in a new tab" con VisuallyHidden.',
    ],
    related: ["button", "visually-hidden"],
  },
  {
    slug: "nav-item",
    name: "NavItem",
    group: "actions",
    level: "átomo",
    summary: "Elemento de la navegación principal dentro del Header.",
    demo: (
      <div className={styles.row}>
        <NavItem href="/" label="Inicio" icon={<Home />} selected />
        <NavItem href="/about" label="Sobre mí" icon={<User />} />
        <NavItem href="/work" label="Trabajo" icon={<ViewGrid />} showLabel={false} />
      </div>
    ),
    usage: `<NavItem href="/work" label="Work" icon={<ViewGrid />} selected compactOnMobile />`,
    props: [
      { name: "href", type: "string", required: true, description: "Destino." },
      {
        name: "label",
        type: "string",
        required: true,
        figma: "Label",
        description: "Siempre es el nombre accesible, aunque esté oculto.",
      },
      {
        name: "icon",
        type: "ReactNode",
        required: true,
        figma: "Icon",
        description: "Un elemento de Iconoir.",
      },
      {
        name: "selected",
        type: "boolean",
        default: "false",
        figma: "Selected",
        description: 'Página actual: aria-current="page" e ícono en Cerezo.',
      },
      {
        name: "showLabel",
        type: "boolean",
        default: "true",
        figma: "showLabel",
        description: "false = solo ícono.",
      },
      { name: "compactOnMobile", type: "boolean", description: "Solo ícono por debajo de 768 px." },
    ],
    use: ["Solo dentro de Header, uno por sección principal del sitio."],
    avoid: ["Fuera del Header: para enlaces sueltos usa Link standalone."],
    accessibility: ['aria-current="page" marca la página actual; el color no es la única señal.'],
    related: ["header"],
  },
  {
    slug: "chip",
    name: "Chip",
    group: "actions",
    level: "átomo",
    unused: true,
    summary: "Chip interactivo: filtro que se alterna, o token que se puede quitar.",
    demo: (
      <div className={styles.stack}>
        <ChipDemo />
      </div>
    ),
    usage: `<Chip label="Fintech" selected={on} onClick={toggle} />
<Chip label="Research" onRemove={() => remove("Research")} />`,
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        figma: "Label",
        description: "Texto del chip.",
      },
      { name: "size", type: '"m" | "s"', default: '"m"', figma: "Size", description: "Tamaño." },
      {
        name: "leadingIcon",
        type: "ReactNode",
        figma: "LeadingIcon",
        description: "Ícono antes del texto.",
      },
      {
        name: "trailingIcon",
        type: "ReactNode",
        figma: "TrailingIcon",
        description:
          "Filtro: marca de estado después del texto, decorativa (p. ej. Check en una cuerda afinada). El estado también va en texto cerca del chip.",
      },
      {
        name: "selected",
        type: "boolean",
        default: "false",
        description: "Filtro: estado del toggle (aria-pressed). Excluyente con onRemove.",
      },
      { name: "onClick", type: "() => void", description: "Filtro: alterna el estado." },
      {
        name: "onRemove",
        type: "() => void",
        description: "Token removible: la X es el único botón.",
      },
      { name: "disabled", type: "boolean", description: "Sin interacción." },
    ],
    use: [
      "Filtros de la lista de trabajo (todavía no existen: entra cuando haya filtros).",
      "Elegir una opción que se alterna, como la cuerda o el modo Automático del afinador del lab.",
    ],
    avoid: ["Para información que no se toca: usa Tag.", "Para un estatus: usa Badge."],
    accessibility: [
      "El filtro es <button aria-pressed>.",
      'El removible no es toggle: solo la X es botón, con aria-label "Remove <label>".',
    ],
    related: ["tag", "badge"],
  },
  {
    slug: "search-field",
    name: "SearchField",
    group: "actions",
    level: "molécula",
    unused: true,
    summary:
      "Campo de búsqueda que filtra una lista en sitio por nombre o caso de uso. No es un campo de formulario.",
    demo: (
      <div className={styles.stack}>
        <SearchFieldDemo />
        <SearchFieldDemo initial="filtrar" showLabel />
        <SearchFieldDemo size="s" />
        <SearchFieldDemo disabled />
      </div>
    ),
    usage: `const [query, setQuery] = useState("");
<SearchField label="Search components" placeholder="Search by name or use" value={query} onChange={setQuery} />`,
    props: [
      {
        name: "label",
        type: "string",
        required: true,
        figma: "Label",
        description: "Nombre accesible. Oculto salvo con showLabel.",
      },
      {
        name: "showLabel",
        type: "boolean",
        default: "false",
        figma: "showLabel",
        description: "Muestra el label cuando el contexto no basta.",
      },
      {
        name: "placeholder",
        type: "string",
        figma: "Placeholder",
        description: "Pista; nunca reemplaza al label.",
      },
      {
        name: "value",
        type: "string",
        required: true,
        figma: "Value · State=Filled",
        description: "Controlado; con texto pasa a filled (data-filled).",
      },
      {
        name: "onChange",
        type: "(value: string) => void",
        required: true,
        description: 'Recibe el texto; limpiar y Esc mandan "".',
      },
      {
        name: "size",
        type: '"m" | "s"',
        default: '"m"',
        figma: "Size",
        description: "40 o 32 de alto; el texto es 16 px en ambos.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        figma: "State=Disabled",
        description: "Sin hover ni foco.",
      },
      {
        name: "clearLabel",
        type: "string",
        default: '"Clear search"',
        description: "Nombre accesible del botón limpiar.",
      },
    ],
    use: [
      "Filtrar una lista en la misma página por texto libre: nombre o caso de uso.",
      "Junto a Chip cuando además hay categorías fijas.",
    ],
    avoid: [
      "Formularios con envío o validación: no tiene error ni submit.",
      "Filtrar por categoría cerrada: usa Chip.",
    ],
    accessibility: [
      '<search> con <label> siempre presente e <input type="search">.',
      "Limpiar devuelve el foco al input; Esc también limpia.",
      "El conteo de resultados lo anuncia la página con aria-live, no el componente.",
    ],
    related: ["chip"],
  },
];
