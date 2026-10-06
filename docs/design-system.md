# Design system del portafolio · v0.1

Sistema de diseño **solo para alancisneros.design**. No es un producto aparte: vive en este repo y crece al ritmo de la migración (`docs/migration-plan.md`).

- **Fuente de verdad:** `alan-brand-guidelines.md` §14, "Identidad visual" (v1.1, 2 de octubre de 2026). Si este documento y la guía de marca difieren, manda la guía.
- **En código:** `src/styles/tokens.css` (variables CSS) y `src/ui/` (componentes con **CSS Modules**).
- **En Figma:** archivo *PDS · Portfolio Design System*, página `01 Foundations`. Cada variable lleva su nombre CSS en *Code syntax → Web*, con el formato `var(--nombre)` que Figma muestra en Dev Mode.

## Decisiones v0.1

| Tema | Decisión | Por qué |
|---|---|---|
| Estilos | CSS Modules + variables CSS | Sin dependencias nuevas, convive con Once UI durante la migración y se lee como CSS normal. |
| Modo | **Solo oscuro** | La marca reserva el modo claro para documentos e impresión. Sin ThemeToggle. |
| Hover / pressed del acento | Mezclas del mismo Cerezo (`color-mix`) | No agrega colores a la marca ("un solo color de acento"). |
| Espaciado | Escala de 8, con **4 px solo dentro de componentes pequeños** | La marca pide densidad laxa en escala de 8; el 4 resuelve piezas como tags e ícono + texto. |
| Escala tipográfica | Propuesta v0.1, abajo | La marca define familias, no tamaños. Pendiente de validar en Figma. |
| Color contextual | **Capa aparte, arriba de las foundations**: estatus (`--status-*`) y 12 tonos categóricos (`--ctx-*`) | Excepción explícita y acotada a "un solo color cálido": nunca interactiva, en dosis pequeñas, nunca solo color. Ver [Capa contextual](#capa-contextual). |
| Deshabilitado | **"Metal sin mango"**: fondo Acero y texto Aluminio al 65 % hacia Titanio, sin Cerezo | El Cerezo marca donde va la mano; un control deshabilitado pierde la madera. Sin colores nuevos. Ver [Estados de interacción](#estados-de-interacción). |
| Íconos | **Iconoir** para interfaz + **Simple Icons** para logos | Iconoir obtuvo la mejor puntuación contra los criterios de marca y se mantiene activo. Los logos identifican herramientas, así que no cuentan como íconos genéricos. Ver [Iconografía](#iconografía). |

## Reglas de uso (de la marca)

1. **Frío por estructura, cálido por contacto.** Los fríos construyen la estructura. El Cerezo es el único color cálido y aparece **solo donde va la mano**: botones, enlaces, foco y estados activos. Nunca como decoración. La única excepción son los colores de la [capa contextual](#capa-contextual), que nunca son interactivos.
2. **La serif es la voz.** Newsreader solo en titulares editoriales, citas y principios. **Nunca** en botones, formularios ni navegación.
3. **Bordes que se funden.** Las tarjetas se distinguen por el tono de la superficie, no por líneas. Si un borde es indispensable: 1 px de `--color-border-subtle`. La estructura se muestra con alineación, numeración y metadata.
4. **Radios concéntricos:** radio interior = radio exterior − padding. Tarjetas a 20 px, controles a 12 px.
5. **Movimiento "cierre suave":**
   - todo movimiento responde a una acción;
   - las piezas se transforman desde donde vienen;
   - los grupos entran en secuencia (`--stagger-step`);
   - nada dura más de 400 ms y no hay rebote;
   - con *reducir movimiento*, solo cambios de opacidad.
6. **Nunca:** fotos de stock, íconos genéricos, gradientes de moda, texturas que imiten materiales (madera, metal, concreto), motivos culturales decorativos, ni un minimalismo frío que borre la calidez.

## Color

| Token | Primitivo | Hex | Uso |
|---|---|---|---|
| `--color-bg-page` | Titanio | `#0E1114` | Fondo base |
| `--color-bg-surface` | Grafito | `#171B20` | Tarjetas bento |
| `--color-bg-elevated` | Acero | `#20262D` | Superficies elevadas |
| `--color-text-primary` | Niebla | `#E8ECF1` | Texto principal |
| `--color-text-secondary` | Aluminio | `#8C96A3` | Texto secundario y líneas |
| `--color-border-subtle` | Aluminio 12 % | — | Borde solo si es indispensable |
| `--color-accent` | Cerezo | `#D2734E` | Acción: botones, enlaces, foco, activo |
| `--color-accent-hover` | Cerezo 85 % + Niebla | ≈ `#D78667` | Hover del acento |
| `--color-accent-pressed` | Cerezo 92 % + Titanio | ≈ `#C06B4A` | Pressed del acento |
| `--color-accent-strong` | Cerezo profundo | `#8E3B22` | Fondos de acento |
| `--color-on-accent` | Titanio | `#0E1114` | Texto sobre acento, hover y pressed |
| `--color-on-accent-strong` | Niebla | `#E8ECF1` | Texto sobre Cerezo profundo |
| `--color-focus-ring` | Cerezo | `#D2734E` | Anillo de foco |

Los componentes usan **solo tokens semánticos** (`--color-*`), nunca `--palette-*` ni hex.

### Contraste verificado (WCAG 2.1)

| Texto | Fondo | Ratio | Resultado |
|---|---|---|---|
| Niebla | Titanio / Grafito / Acero | 15.96 / 14.58 / 12.86 | AA |
| Aluminio | Titanio / Grafito / Acero | 6.32 / 5.77 / 5.09 | AA |
| Cerezo | Titanio / Grafito | 5.68 / 5.19 | AA |
| Cerezo | Acero | 4.58 | AA justo: **evitar enlaces Cerezo sobre superficies elevadas** |
| Titanio | Cerezo / hover / pressed | 5.68 / 6.76 / 4.90 | AA |
| Niebla | Cerezo profundo | 6.32 | AA |
| Niebla | Cerezo | 2.81 | **Falla**: el texto sobre Cerezo va siempre en Titanio |

## Estados de interacción

Los **estados** (`--state-*`) describen cómo está un control interactivo. No deben confundirse con el **estatus** (`--status-*`), que comunica un resultado.

| Estado | Tokens | Notas |
|---|---|---|
| Default | `--color-accent`, `--color-on-accent` | Cerezo solo donde va la mano |
| Hover | `--color-accent-hover` | `--duration-fast`, `--ease-settle` |
| Pressed | `--color-accent-pressed` | — |
| Focus visible | `--color-focus-ring` | `outline: 2px`, `outline-offset: 2px` |
| **Disabled** | `--state-disabled-fg`, `--state-disabled-bg`, `--state-disabled-border` | Ver abajo |

### Disabled · "metal sin mango"

El Cerezo es el mango de madera de una herramienta de metal. Cuando la mano ya no puede ir, **la madera se va** y queda solo la estructura fría.

| Token | Valor | Contraste |
|---|---|---|
| `--state-disabled-fg` | Aluminio 65 % + Titanio (oklab) ≈ `#5C636C` | 3.11 sobre page · 2.84 sobre surface · 2.51 sobre elevated |
| `--state-disabled-bg` | Acero `#20262D` | Fondo de un control relleno deshabilitado |
| `--state-disabled-border` | = `--color-border-subtle` | Solo si el control normal tiene borde |

- **Contraste:** WCAG exime a los componentes inactivos (1.4.3 y 1.4.11), pero se mantienen perceptibles: unos 3:1 sobre page, y **la mitad de luminosos que el texto secundario**, para que no se lean como texto normal.
- **Por qué no opacidad:** un botón Cerezo al 40 % queda en `#5C382B`, que sigue siendo cálido y dice "aquí va la mano". Además, la opacidad cambia según el fondo.
- **Comportamiento:**
  - sin hover, sin pressed y sin transiciones (nada se mueve sin causa);
  - `cursor: not-allowed`;
  - el control mantiene su tamaño.
- **Honestidad:** si el motivo no es obvio, el control usa `aria-disabled="true"`, sigue siendo enfocable y explica **por qué** junto al control. El `disabled` nativo se usa solo cuando el motivo es evidente.
- Los íconos dentro del control toman `--state-disabled-fg`.

## Capa contextual

Color de **estatus** y de **contexto** que vive **arriba de las foundations**. Aquí sí se usan todos los tonos del arcoíris: es una excepción explícita a la regla de marca "un solo color cálido", con límites claros.

### Reglas

1. **Nunca donde va la mano.** Botones, enlaces, foco y estados activos siguen siendo exclusivos del Cerezo. Un color contextual nunca es interactivo.
2. **Dosis pequeñas.** Va en badges, tags, puntos de estado, marcas de gráficas y fondos tenues de avisos (`-bg`), nunca en superficies grandes.
3. **Nunca solo color.** Siempre va con un ícono de Iconoir y con texto (WCAG 1.4.1).
4. **Máximo 6 categorías a la vez.** A cada categoría se le asigna un tono fijo (por ejemplo `finanzas → blue`), siempre el mismo en todo el sitio.
5. **Roles por tono:** `-fg` para texto e íconos, `-bg` para un contenedor tenue y `-border` para el borde opcional de ese contenedor.

### Estatus (`--status-*`)

Indican el resultado o la condición de algo: éxito, alerta, error o información. No son lo mismo que los [estados de interacción](#estados-de-interacción). Tienen valores propios, no alias del arcoíris. La luminosidad cambia por estado para que se distingan también con daltonismo.

| Estado | fg | bg | border | Contraste sobre page · elevated · su bg | ΔE vs Cerezo |
|---|---|---|---|---|---|
| `success` | `#77E3B7` · verde menta | `#0D2D21` | `#135B42` | 12.17 · 9.80 · 9.51 | 28.7 |
| `warning` | `#F8CA65` · ámbar | `#302409` | `#61490C` | 12.30 · 9.91 · 9.81 | 22.6 |
| `danger` | `#F275A0` · frambuesa | `#381D25` | `#70394B` | 7.07 · 5.69 · 5.73 | 12.5 |
| `info` | `#72B8F2` · azul | `#12283B` | `#225176` | 8.91 · 7.18 · 7.07 | 25.7 |
| `neutral` | Aluminio | Acero | — | 6.32 · 5.09 | — |

- **Distinción:** la distancia mínima entre dos estados es ΔE 16.2 con visión normal y **8.8 en el peor caso de daltonismo** (éxito e info con tritanopía).
- **Rojo de error:** es un **frambuesa**, desplazado hacia el rosa. Un rojo puro quedaba a ΔE 7.2 del Cerezo y un error podía leerse como acción.
- La primera versión, con la misma luminosidad para todos, hacía que éxito y error fueran casi idénticos con deuteranopía (ΔE 0.8). Por eso se descartó.

### Contexto categórico (`--ctx-<tono>-*`)

Son 12 tonos cada 30° aproximadamente, todos con **la misma luminosidad (OKLCH L 0.80) y saturación (C ≈ 0.12)**, así que se leen como una sola familia.

| Tono | fg | bg | border | | Tono | fg | bg | border |
|---|---|---|---|---|---|---|---|---|
| `red` | `#FFA098` | `#3A1D1B` | `#733A36` | | `teal` | `#52D7C1` | `#052D27` | `#015A4F` |
| `orange` | `#F9A870` | `#372010` | `#6E401E` | | `cyan` | `#47D2E8` | `#022C33` | `#025763` |
| `amber` | `#E6B55D` | `#32240A` | `#64470E` | | `blue` | `#89C3FE` | `#14283C` | `#285077` |
| `yellow` | `#D0BF5E` | `#2C270A` | `#574E0E` | | `indigo` | `#ABB9FE` | `#20243C` | `#414978` |
| `lime` | `#A4CD79` | `#1F2B12` | `#3E5624` | | `violet` | `#C9ACFF` | `#2A2139` | `#544272` |
| `green` | `#83D494` | `#152D1A` | `#295935` | | `magenta` | `#F19FD6` | `#351D2D` | `#6A3B5B` |

- **Contraste del texto:** entre 9.6 y 10.7:1 sobre page, y entre 7.8 y 8.6:1 sobre su propio `-bg`. Todo AA.
- **Separación del Cerezo:** todos los tonos son más claros y menos saturados que el Cerezo (L 0.655, tono 41.6°). Los más cercanos son `orange` (ΔE 14.8) y `red` (15.0), así que conviene no ponerlos junto a un botón.
- **Usos previstos:** industrias, tipo de pieza (caso de estudio, experimento del lab, artículo), herramientas y series de gráficas.

## Iconografía

| Rol | Librería | Paquete |
|---|---|---|
| Interfaz | **Iconoir** (MIT) | `iconoir-react` |
| Logos de herramientas | **Simple Icons** (íconos CC0; respetar las guías de cada marca) | `@icons-pack/react-simple-icons` |

### Reglas

1. **Una sola familia en la interfaz (Iconoir)**, con trazo de 1.5 px, el valor por defecto. No se mezcla con otras librerías.
2. **Siempre con texto**, salvo los universales: cerrar, menú, flecha y enlace externo. Esos llevan `aria-label`.
3. **Nunca decorativos.** Un ícono está ahí porque cumple una función, igual que el movimiento.
4. **El color sigue al texto:** `--color-text-secondary` por defecto. Solo se vuelven Cerezo si son interactivos, y toman el `-fg` de un estado o tono solo dentro de la capa contextual.
5. **Los momentos de firma se dibujan a mano:** la marca de taller y el colofón. Ahí no va ningún ícono de librería.
6. **En Figma solo viven los íconos que se usan**, como componentes en `02 Icons`.
7. `react-icons` (que hoy mezcla Font Awesome, Heroicons, css.gg y Phosphor) sale del proyecto en I3.

## Espaciado, radios y layout

| Token | Valor | Uso |
|---|---|---|
| `--space-4` | 4 px | Solo dentro de componentes pequeños |
| `--space-8` … `--space-64` | 8, 16, 24, 32, 48, 64 px | Todo lo demás |
| `--radius-control` | 12 px | Botones, inputs, callouts |
| `--radius-card` | 20 px | Tarjetas bento |
| `--radius-pill` | 999 px | Tags, chips, badges, `NavItem`, el menú del `Header`, avatares y otras formas circulares |
| `--page-padding` | 16 px → 24 px desde 768 | Padding de página |
| `--bento-gap` | 16 px → 24 px desde 768 | Separación entre tarjetas |

- **Breakpoints:** 390 (diseño mobile), 768 (tablet) y 1280 (desktop).
- La retícula bento colapsa a **una columna** en mobile.
- En los *media queries* se escribe el número literal (`@media (min-width: 768px)`), porque las variables CSS no funcionan ahí.

## Tipografía

| Rol | Familia | Variable |
|---|---|---|
| Sistema (aluminio) | Geist Sans | `--font-sans` |
| Voz (cerezo) | Newsreader | `--font-serif` |
| Medida (calibrador) | Geist Mono | `--font-mono` |

### Escala v0.1 (coincide con los 13 estilos de texto de Figma, auditoría del 2026-10-05)

| Estilo | Familia | Tamaño / interlineado | Peso |
|---|---|---|---|
| `display` | Newsreader | 40 → 56 px (fluido) / 1.14 | 400 |
| `title` | Newsreader | 32 → 40 px (fluido) / 1.2 | 400 |
| `quote` | Newsreader itálica | 24 / 32 | 400 |
| `heading-l` | Geist Sans | 32 / 40 | 600 |
| `heading-m` | Geist Sans | 24 / 32 | 600 |
| `heading-s` | Geist Sans | 20 / 28 | 600 |
| `body-l` | Geist Sans | 18 / 28 | 400 |
| `body-m` | Geist Sans | 16 / 24 | 400 |
| `body-s` | Geist Sans | 14 / 20 | 400 |
| `label-m` | Geist Sans | 14 / 20 | 500 |
| `label-s` | Geist Sans | 12 / 16 | 500 |
| `meta` | Geist Mono | 12 / 16, tracking 0.04em | 400 |

**Carga de fuentes:**

- **Geist Sans y Geist Mono**, desde I3, con el paquete oficial `geist` (archivos locales). Exponen `--font-geist-sans` y `--font-geist-mono`. Hoy (T0) Geist Sans se carga con `next/font/google`.
- **Newsreader** con `next/font/google`, que expone `--font-newsreader`.
- **Por qué locales:** en T0, un deploy de producción falló al resolver una fuente de Google Fonts con la caché de build de Vercel, y se resolvió con un redeploy. Las fuentes locales evitan esa dependencia del build. Ver `docs/migration-plan.md` → I3.
- Fuera de los tags de About, el sitio sigue con Figtree y Azeret Mono hasta I3.

## Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--ease-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas y expansiones |
| `--ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elementos que se retiran |
| `--duration-fast` | 150 ms | Hover, presión, toggles |
| `--duration-base` | 250 ms | Tarjetas, menús, cambios de estado |
| `--duration-wide` | 400 ms | Transiciones de pantalla (máximo) |
| `--stagger-step` | 40 ms (0 con *reducir movimiento*) | Secuencia de grupos |

## Convenciones de componentes (CSS Modules)

- **Ubicación:** `src/ui/<Nombre>/<Nombre>.tsx` + `<Nombre>.module.css` + `index.ts`. `src/ui` **no importa nada de la app** ni de Once UI.
- **Solo tokens:** color, espacio, radio, tipografía y movimiento con `var(--…)`. Sin hex ni px sueltos, salvo `0` y bordes de `1px`. Más adelante se automatiza con un lint (stylelint `declaration-strict-value`).
- **Variantes con atributos `data-*`:** `data-variant="primary"`, `data-size="s"`. Los nombres y valores son los mismos que las propiedades del componente en Figma.
- **Figma ↔ props:** en Figma la propiedad va con mayúscula (`Variant`, `Size`, `State`); lo que coincide 1:1 con el prop es el **valor** (`variant="primary"`). `State` no es un prop: en código es `:hover`, `:active`, `:focus-visible` o `disabled`.
- **`FocusRing` en Figma:** su radio es el del control + 4, concéntrico con el `outline-offset` de 2 px más el trazo de 2 px. Es la única capa con radio sin variable; en código, `outline` sigue el `border-radius` del control.
- **Foco visible** en todo lo interactivo: `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` en `:focus-visible`.
- **Accesibilidad:** HTML semántico primero; `aria-label` en controles sin texto visible.
- **Movimiento:** transiciones con tokens. Dentro de `@media (prefers-reduced-motion: reduce)` solo se anima `opacity`.

## Componentes del portafolio

Los 25 componentes v0.1 están **diseñados en Figma, auditados y en código** (`src/ui/`, importables desde `@/ui`), y casi todos ya están **en producción**. Sin uso público todavía: `Badge`, `Card`, `Carousel` y `Chip` (este último entra cuando haya filtros).

- **Catálogo privado:** `/lab/ui`, detrás del Basic Auth del lab y con `noindex`. Muestra cada componente con sus variantes, para compararlo con Figma.
- **Página de Figma:** cada grupo vive en su propia página del archivo *PDS · Portfolio Design System*.

| Grupo (Figma) | Componentes | Sin uso público |
|---|---|---|
| 02a Actions | `Button`, `IconButton`, `Link`, `NavItem`, `Chip` | `Chip` |
| 02b Content | `Tag`, `Divider`, `Avatar`, `AvatarGroup`, `Badge`, `Callout`, `List`/`ListItem` | `Badge` |
| 02c Data & Media | `Table`, `CodeBlock`, `Accordion`, `Media`, `Carousel` | `Carousel` |
| 02d Navigation | `TableOfContents`/`TocItem`, `HeadingLink` | — |
| 02e Cards & Site | `Card`, `ProjectCard`, `Header`, `Footer`, `TeamCard` | `Card` |

### Notas de implementación

- **Solo es cliente lo que tiene estado** (`"use client"`): `CodeBlock`, `Carousel`, `TableOfContents`, `HeadingLink`, `Header` y el video de `Media`. Lo demás es server component. Los íconos de `iconoir-react` son client components.
- **Foco:** `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` en todo lo interactivo. Es la capa `FocusRing` de Figma.
- **Sin layout shift:** `Media`, `ProjectCard` y `Carousel` reservan el *aspect-ratio*. `Header` tiene alto fijo y reserva el ancho del reloj antes de hidratar.
- **Accesibilidad:**
  - `Accordion` usa `<details>/<summary>` nativo;
  - `Chip` filtro es `<button aria-pressed>`, y el `Chip` removible deja la X como único botón;
  - `IconButton` requiere `label`;
  - los `Link` externos anuncian "opens in a new tab" (los textos accesibles van en inglés, como la página);
  - `CodeBlock` y `HeadingLink` confirman con `aria-live`, sin Toast.
- **`TeamCard` (02e, `83:152`):** tarjeta estática de integrante (avatar, nombre, rol y descripción), con `layout` horizontal o vertical. El rol nunca va en Cerezo. Su patrón `TeamGrid` (03 Patterns, `84:87`) vive en `src/components/work/TeamGrid.tsx` y se usa desde el MDX.
- **Proyecto destacado (`home.featured` en `content.tsx`):** un `Link` standalone sobre el titular de Home que lleva al caso destacado. Se apaga con `display: false`.
- **Decisión de auditoría · hover de tarjetas:** `Card` y `ProjectCard` se funden con sus superficies internas en hover, a propósito.
- **`Link` inline siempre subrayado** (2026-10-05, revierte la decisión de auditoría del 2026-10-03): dentro de un párrafo, el Cerezo contra el texto Niebla da unos 2.8:1, por debajo de los 3:1 que pide WCAG 1.4.1 cuando el enlace se distingue solo por color. El subrayado (`text-decoration-thickness: from-font`) lo resuelve sin depender del color. `standalone` no lleva subrayado: lo distingue su ícono.

## Pendientes

- Validar la escala tipográfica en pantallas reales.
- Que la marca de taller (en proceso) se incorpore cuando exista; no inventar una.
- Asignar tonos `--ctx-*` a las categorías reales (industrias y tipos de pieza) cuando se definan en I5.
- Token de resorte para gestos y arrastres (marca §14: amortiguamiento crítico, sin rebote). Se define cuando exista el primer gesto.
- Los tokens con `color-mix` (`accent/hover`, `accent/pressed`, `state/*`) tienen hex estático en Figma: si cambia un primitivo, hay que recalcularlos a mano.
- Figma: radios sin variable en `Avatar`, el `Dot` del `Carousel` y el `PlayButton` de `Media`, y `Tag` con `Size=Medium/Small` en lugar de `m/s` (S2).
