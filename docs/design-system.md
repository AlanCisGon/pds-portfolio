# Design system del portafolio · v0.1

Sistema de diseño **solo para alancisneros.design**. No es un producto aparte: vive en este repo y crece al ritmo de la migración (`docs/migration-plan.md`).

- **Fuente de verdad:** `alan-brand-guidelines.md` §14, "Identidad visual" (v1.1, 2 de octubre de 2026). Si este documento y la guía de marca difieren, manda la guía.
- **En código:** `src/styles/tokens.css` (variables CSS) y `src/ui/` (componentes con **CSS Modules**).
- **En Figma:** archivo *PDS · Portfolio Design System*, página `01 Foundations`. Las variables usan los mismos nombres que el CSS (*Code syntax → Web*).

## Decisiones v0.1

| Tema | Decisión | Por qué |
|---|---|---|
| Estilos | CSS Modules + variables CSS | Sin dependencias nuevas, convive con Once UI durante la migración y se lee como CSS normal. |
| Modo | **Solo oscuro** | La marca reserva el modo claro para documentos e impresión. Sin ThemeToggle. |
| Hover / pressed del acento | Mezclas del mismo Cerezo (`color-mix`) | No agrega colores a la marca ("un solo color de acento"). |
| Espaciado | Escala de 8, con **4 px solo dentro de componentes pequeños** | La marca pide densidad laxa en escala de 8; el 4 resuelve piezas como tags e ícono + texto. |
| Escala tipográfica | Propuesta v0.1, abajo | La marca define familias, no tamaños. Pendiente de validar en Figma. |
| Colores de estado | **Ninguno por ahora** | La marca prohíbe más de un color cálido, y sin formularios no hacen falta. Se decide cuando haya un caso real. |

## Reglas de uso (de la marca)

1. **Frío por estructura, cálido por contacto.** Los fríos construyen la estructura. El Cerezo es el único color cálido y aparece **solo donde va la mano**: botones, enlaces, foco y estados activos. Nunca como decoración.
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

## Espaciado, radios y layout

| Token | Valor | Uso |
|---|---|---|
| `--space-4` | 4 px | Solo dentro de componentes pequeños |
| `--space-8` … `--space-64` | 8, 16, 24, 32, 48, 64 px | Todo lo demás |
| `--radius-control` | 12 px | Botones, inputs, tags |
| `--radius-card` | 20 px | Tarjetas bento |
| `--radius-pill` | 999 px | Píldoras (si el diseño lo pide) |
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

### Escala v0.1 (propuesta, por validar en Figma)

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

Las fuentes se cargan con `next/font/google`, que expone `--font-geist-sans`, `--font-newsreader` y `--font-geist-mono`. Se conectan en `layout.tsx` junto con el primer componente que las use (piloto T0). Hasta entonces el sitio sigue con Figtree y Azeret Mono.

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
- **Foco visible** en todo lo interactivo: `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` en `:focus-visible`.
- **Accesibilidad:** HTML semántico primero; `aria-label` en controles sin texto visible.
- **Movimiento:** transiciones con tokens. Dentro de `@media (prefers-reduced-motion: reduce)` solo se anima `opacity`.

## Componentes del portafolio

Solo lo que el portafolio usa. El orden y el incremento vienen de `docs/migration-plan.md`.

| Componente | Incremento | Notas de marca |
|---|---|---|
| `Tag` | T0 (piloto) | Geist Sans `label-s`, superficie tonal, sin acento (no es interactivo) |
| `Divider` | I2 | `--color-border-subtle`; usar poco |
| `Button`, `IconButton`, `Link` | I4 | Acento Cerezo; texto Titanio sobre él; foco Cerezo |
| `Avatar`, `Badge` | I4 | — |
| `Header`, `Footer` | I4 | Sin ThemeToggle (solo oscuro) |
| `ProjectCard`, bloques MDX | I5 | Tarjetas bento con radio 20 y superficies por tono |
| Home, About, 404 | I6 | Newsreader para los titulares editoriales |
| Colofón | I6 | Firma de marca: materiales, decisiones, versiones y equipo |

## Pendientes

- Validar la escala tipográfica en Figma y en pantallas reales.
- Que la marca de taller (en proceso) se incorpore cuando exista; no inventar una.
- Colores de estado, si aparece un caso real.
