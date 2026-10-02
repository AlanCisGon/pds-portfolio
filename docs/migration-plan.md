# Plan de migración: de Magic Portfolio a un sistema propio

## Objetivo
Dejar de depender del fork de **Magic Portfolio** y de **Once UI**, y quedarse con un portafolio propio. Se hace en incrementos chicos, cada uno desplegable por separado, y sin una reescritura "big bang".

**Estrategia:** *strangler fig*, es decir, reemplazar pieza por pieza mientras el sitio sigue en producción. Cada incremento:

1. Tiene una hipótesis Lean UX (ver `CLAUDE.md` → *Design Principles*).
2. Si cambia algo visual, se diseña primero en Figma y se pasa a código con handoff vía el MCP de Figma.
3. Va en su propia rama, con un PR y su preview de Vercel. Opcionalmente se prueba en `dev`, luego se hace squash a `main`.
4. Se mide después de salir a producción: Core Web Vitals, peso de JS, páginas vistas.

**Reglas durante la migración**
- El código nuevo va en `src/ui/` y usa los tokens de `src/styles/tokens.css`.
- No se agregan nuevos usos de Once UI.
- Un componente se considera migrado cuando ya no queda ningún import suyo desde `@once-ui-system/core`.

## Punto de partida (2026-10-02)

- **27 archivos** importan `@once-ui-system/core`.
- Los estilos base salen de `@once-ui-system/core/css/styles.css` y `tokens.css`, importados en `src/app/layout.tsx`.
- Las rutas `/blog` y `/gallery` están desactivadas (`routes` en `once-ui.config.ts`), pero su código sigue en el repo.

| Uso | Componentes de Once UI | Archivos |
|---|---|---|
| Layout | `Column` (15), `Row` (12), `Flex` (8), `Grid`, `Line` | casi todos |
| Tipografía | `Text` (13), `Heading` (12), `InlineCode` | casi todos |
| SEO | `Meta` (8), `Schema` (7) | todas las páginas |
| Acciones | `Button` (7), `IconButton`, `ToggleButton`, `SmartLink` | Header, Footer, páginas |
| Media | `Media` (6), `Avatar`, `AvatarGroup`, `Carousel`, `MasonryGrid` | about, work, ProjectCard, gallery |
| MDX | `Table`, `CodeBlock`, `Accordion`, `List`, `Feedback`, `HeadingLink`, `HeadingNav`, `Card` | `components/mdx.tsx`, blog |
| Providers / tema | `ThemeProvider`, `DataThemeProvider`, `LayoutProvider`, `IconProvider`, `ToastProvider`, `useTheme`, `useToast` | `Providers.tsx`, `ThemeToggle`, `HeadingLink` |
| Efectos | `Background`, `RevealFx`, `Fade` | layout, home, Header |
| Formularios | `Input`, `PasswordInput`, `Spinner` | Mailchimp, RouteGuard |

## Incrementos

Tamaño estimado: **S** es menos de un día de trabajo conjunto, **M** son 1 a 3 sesiones, **L** es más que eso.

### I0 · Bases y medición (S, sin cambios visuales)
- **Hipótesis:** si tenemos tokens compartidos y una línea base, cada incremento posterior se podrá comparar y validar.
- **Pasos:**
  - Crear el archivo de Figma (ver [Setup de Figma](#setup-de-figma)).
  - Crear `src/styles/tokens.css` con los tokens propios. Al inicio son alias de los valores actuales de Once UI, así que no cambia nada visible.
  - Crear la carpeta `src/ui/`.
  - Registrar la línea base: CWV de Speed Insights, Lighthouse móvil de `/`, `/about` y `/work/project-helix`, y el peso de JS por ruta que reporta `next build`.
- **Listo cuando:** existen los tokens en código y en Figma con los mismos nombres, y la línea base está anotada al final de este documento.

### I1 · Poda (S)
- **Hipótesis:** quitar el código que no se usa reduce lo que hay que migrar en más o menos un tercio, sin impacto para los visitantes.
- **Pasos:** borrar lo que está desactivado o es de la plantilla:
  - `/blog`, con sus 11 posts de ejemplo, `Post`, `Posts` y `ShareSection`
  - `/gallery`
  - `Mailchimp`
  - `RouteGuard`, `/api/authenticate` y `/api/check-auth`. La protección de `project-helix` ya está desactivada y `/lab` cubre lo privado.
  - `/api/rss`, si no hay blog
  - las entradas correspondientes en `once-ui.config.ts`, `content.tsx`, `sitemap.ts` y los tipos
- **Listo cuando:** `next build` pasa y las rutas públicas responden igual.

### I2 · Primitivas de layout y tipografía (M)
- **Hipótesis:** reemplazar los componentes más usados elimina la mayoría de los imports de Once UI sin cambiar la apariencia.
- **Pasos:**
  - Crear en `src/ui/`: `Stack` (sustituye a `Column`, `Row` y `Flex`), `Grid`, `Divider` (sustituye a `Line`), `Text`, `Heading` y `Code`. Usan CSS Modules y tokens.
  - Migrar todos los usos.
- **Listo cuando:** no queda ningún import de esos componentes y no hay regresiones visuales en el preview (comparar capturas).

### I3 · Tema y providers (M)
- **Hipótesis:** un tema propio, con `data-theme` en `<html>` y un script que evita el destello al cargar, nos da control total de los modos claro y oscuro.
- **Pasos:**
  - Crear `ThemeProvider` y `ThemeToggle` propios.
  - Usar los íconos de `react-icons` directamente.
  - Quitar `DataThemeProvider`, `LayoutProvider`, `IconProvider` y `ToastProvider`. Para el aviso de "copiado" de `HeadingLink` basta un toast mínimo propio o un `aria-live`.
  - Dejar los tipos de configuración propios en `src/types`.

### I4 · El marco del sitio: primer handoff real desde Figma (M)
- **Hipótesis:** un Header y un Footer propios, más claros, ayudan al reclutador a encontrar contacto y CV en menos de 10 segundos.
- **Pasos:**
  - Diseñar en Figma `Button`, `IconButton`, `ToggleButton`, `Link`, `Avatar`, `Badge`, `Tag`, `Header` y `Footer`.
  - Pasarlos a código con handoff.
  - `SmartLink` se reemplaza por un `Link` propio basado en `next/link`.

### I5 · Casos de estudio (L)
- **Hipótesis:** una plantilla de caso de estudio estructurada (contexto → problema → rol → proceso → resultados → aprendizajes) hace que los hiring managers lean más a fondo.
- **Pasos:**
  - Diseñar `ProjectCard` y la plantilla de `/work/[slug]`.
  - Crear los componentes MDX: `Table`, `CodeBlock`, `Accordion`, `List`, `Callout` (sustituye a `Feedback`), `Media`, `Carousel`, el índice de encabezados y `HeadingLink`.
  - Migrar `components/mdx.tsx`.
- **Señal:** tiempo en página y scroll en `/work/*`, si el plan de Vercel lo permite; si no, la cantidad de páginas vistas por visita.

### I6 · Home y About con identidad propia (L)
- **Hipótesis:** una portada nueva, con propuesta de valor, casos destacados y contacto, aumenta las visitas a `/work`.
- **Pasos:** rediseñar en Figma y pasar a código. `Background`, `RevealFx` y `Fade` se reemplazan por efectos propios que no muevan el layout, o se eliminan.

### I7 · SEO y cierre (M)
- **Pasos:**
  - Reemplazar `Meta` y `Schema` por la Metadata API de Next y un helper propio de JSON-LD.
  - Quitar los CSS de Once UI de `layout.tsx` y desinstalar `@once-ui-system/core`.
  - Renombrar el paquete en `package.json`.
  - Quitar el remoto `upstream`.
  - Actualizar el README y revisar la licencia: la plantilla está bajo **CC BY-NC 4.0**. Mientras quede código suyo, aplica esa licencia y su atribución. Cuando ya no quede, puedes elegir una licencia propia para tu código; conviene confirmarlo antes de cambiarla.
- **Listo cuando:** `grep -r "@once-ui-system" src` no devuelve nada.

## Setup de Figma

Archivo sugerido: **"PDS · Portfolio Design System"**, en tu equipo Pro.

| Página | Contenido |
|---|---|
| `00 Cover` | Estado del sistema y changelog |
| `01 Foundations` | Variables y estilos de texto |
| `02 Components` | Componentes con variantes |
| `03 Patterns` | Bloques de caso de estudio, hero, listas de proyectos |
| `04 Pages` | Pantallas completas (desktop 1440 y mobile 390) |
| `05 Handoff` | Secciones marcadas **Ready for dev** |

**Variables**
- La colección `Primitives` guarda las escalas de color, espacio, radios y tamaños tipográficos.
- La colección `Semantic` tiene los modos `Light` y `Dark`: `color/bg/page`, `color/bg/surface`, `color/text/primary`, `color/border/subtle`, etc.
- En cada variable define **Code syntax → Web** con el nombre CSS (`--color-bg-surface`). Así `get_variable_defs` devuelve exactamente lo que va en `tokens.css`.

**Tipografía:** Figtree para títulos y cuerpo, Azeret Mono para código y etiquetas, igual que hoy en el sitio.

**Arranque opcional:** puedo crear las variables en Figma a partir de los tokens actuales del código (skills `figma-generate-library` + `figma-use`), o capturar las páginas actuales como punto de partida (`figma-generate-design`). Así no empiezas de cero.

**Handoff:** el flujo está en `CLAUDE.md` → *Figma → Code Handoff*. En corto: marcas *Ready for dev*, me pasas el link del frame con `node-id` y lo implemento en una rama con PR.

**Code Connect:** hasta donde sé, requiere plan Organization o Enterprise de Figma. Mientras tanto, el mapeo vive en la tabla de abajo. Con Code Connect activo, el MCP lo usaría automáticamente.

## Mapeo Figma ↔ código

| Componente en Figma | Código | Reemplaza a | Incremento | Estado |
|---|---|---|---|---|
| `Stack` | `src/ui/Stack` | `Column`, `Row`, `Flex` | I2 | pendiente |
| `Text` / `Heading` | `src/ui/Text`, `src/ui/Heading` | `Text`, `Heading` | I2 | pendiente |
| `Button` | `src/ui/Button` | `Button`, `IconButton` | I4 | pendiente |
| `Header` / `Footer` | `src/components/Header`, `Footer` | `Header`, `Footer` actuales | I4 | pendiente |
| `ProjectCard` | `src/ui/ProjectCard` | `ProjectCard` actual | I5 | pendiente |

## Línea base y resultados

Esta tabla se llena en I0 y se actualiza al cerrar cada incremento.

| Fecha | Incremento | LCP | CLS | INP | JS `/` (kB) | Notas |
|---|---|---|---|---|---|---|
| | I0 | | | | | |
