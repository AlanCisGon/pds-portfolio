# Directivas de diseño para asistentes de IA

Reglas cortas para cualquier asistente (Claude, Copilot, v0…) que genere UI en este repo. Reemplazan al `DSBP.md` genérico (Tailwind/shadcn, modo claro y oscuro), que no aplicaba a este proyecto. El detalle y el porqué de cada regla están en [`design-system.md`](design-system.md); si algo aquí choca con ese documento o con la guía de marca, mandan ellos.

## 1. Tokens, nunca valores sueltos
- Sin Tailwind ni clases utilitarias. Los estilos van en **CSS Modules** junto al componente y usan `var(--…)` de `src/styles/tokens.css`.
- Sin hex, `rgb()` ni px arbitrarios. Las únicas excepciones son `0`, bordes de `1px` y el número literal en `@media`.
- Tokens disponibles:
  - **Color:** `--color-bg-{page,surface,elevated}`, `--color-text-{primary,secondary}`, `--color-border-subtle`, `--color-accent{,-hover,-pressed,-strong}`, `--color-on-accent{,-strong}`, `--color-focus-ring`. Estatus y categorías solo con `--status-*` y `--ctx-*` (nunca interactivos ni como única señal).
  - **Espacio:** `--space-{4,8,16,24,32,48,64}`. El 4 solo se usa dentro de componentes pequeños.
  - **Radio:** `--radius-control` (12), `--radius-card` (20), `--radius-pill`.
  - **Tipo:** `--font-{sans,serif,mono}`, `--text-<rol>-{size,line}` (display, title, quote, heading-l/m/s, body-l/m/s, label-m/s, meta, code), `--weight-{regular,medium,semibold}`.
  - **Movimiento:** `--duration-{fast,base,wide}`, `--ease-{settle,exit}`, `--stagger-step`.

## 2. Usar las primitivas de `src/ui`
- Antes de crear algo nuevo, componer con lo que ya existe (`@/ui`):
  - **Acciones:** `Button`, `IconButton`, `Link`, `NavItem`, `Chip`
  - **Contenido:** `Tag`, `Badge`, `Avatar`, `AvatarGroup`, `Callout`, `Divider`, `List`
  - **Datos y media:** `Table`, `CodeBlock`, `Accordion`, `Media`, `Carousel`
  - **Navegación:** `TableOfContents`, `HeadingLink`
  - **Tarjetas y sitio:** `Card`, `ProjectCard`, `Header`, `Footer`
  - **Utilidades:** `VisuallyHidden`
- Para revisar las variantes de cada componente está el catálogo privado en `/lab/ui`.
- Las variantes se expresan con props que mapean a `data-variant` / `data-size`, con los mismos nombres que en Figma.
- Un componente nuevo va en `src/ui/<Nombre>/` (`.tsx` + `.module.css` + `index.ts`), no importa código de la app y **primero se diseña en Figma** o se marca como propuesta.
- Las páginas solo componen y llevan el CSS de layout.

## 3. Solo modo oscuro
- No hay modo claro, ni `.dark`, ni `data-theme`, ni toggle. `color-scheme: dark` viene de `base.css`.

## 4. Marca
- **El Cerezo (`--color-accent`) va solo donde la persona actúa:** botones, enlaces, foco y estados activos. Nunca como decoración.
- **Amstelvar (`--font-serif`) es la voz:** solo en titulares editoriales, citas y principios. Nunca en botones, formularios ni navegación.
- **Las superficies se separan por tono**, no por bordes. Si un borde es indispensable: `1px solid var(--color-border-subtle)`.
- **Sin** gradientes de moda, sombras decorativas, fotos de stock ni íconos genéricos. Los íconos son de Iconoir y los logos de Simple Icons.

## 5. Accesibilidad (WCAG 2.1 AA)
- Primero HTML semántico: `button` para acciones, `a` para navegar, encabezados en orden.
- **Foco visible** en todo lo interactivo: `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` en `:focus-visible`. Nunca `outline: none` sin reemplazo.
- `aria-label` solo en controles sin texto visible (`IconButton` lo exige con `label`). Los textos accesibles van **en inglés** (`lang="en"`).
- Contraste ≥ 4.5:1 en texto normal y ≥ 3:1 en texto grande y en componentes de interfaz.
- `alt` con significado; `alt=""` si la imagen es decorativa.
- Con `prefers-reduced-motion: reduce`, solo se anima `opacity`.

## 6. Layout y rendimiento
- Mobile first. Breakpoints: 390, 768 y 1280. Padding de página `--page-padding` (16 → 24 desde 768) y separación `--bento-gap`.
- Reservar espacio para media (`aspect-ratio`, `width`/`height`). Cero layout shift (CLS < 0.1).
- Ningún texto de página va escrito en el componente; sale de `src/resources/content.tsx`.
- Server components por defecto. `"use client"` solo si hay estado o efectos.

## Ejemplo
```tsx
// src/components/work/Highlight.tsx
import { home } from "@/resources";
import { Button, Card } from "@/ui";
import styles from "./Highlight.module.css";

// The copy comes from content.tsx; the component only composes src/ui.
export function Highlight() {
  return (
    <section className={styles.grid}>
      <Card eyebrow={home.principle.eyebrow} title={home.principle.title}>
        {home.principle.body}
      </Card>
      <Button href="/work" variant="primary">
        {home.cta}
      </Button>
    </section>
  );
}
```
```css
/* Highlight.module.css: layout only */
.grid {
  display: grid;
  gap: var(--bento-gap);
  padding-inline: var(--page-padding);
}
```
