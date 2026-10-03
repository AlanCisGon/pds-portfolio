# Plan de migración: de Magic Portfolio a un sistema propio

## Objetivo
Dejar de depender del fork de **Magic Portfolio** y de **Once UI**, y quedarse con un portafolio propio. Se hace en incrementos chicos, cada uno desplegable por separado, y sin una reescritura "big bang".

**Estrategia:** *strangler fig*, es decir, reemplazar pieza por pieza mientras el sitio sigue en producción. Cada incremento:

1. Tiene una hipótesis Lean UX (ver `CLAUDE.md` → *Design Principles*).
2. Si cambia algo visual, se diseña primero en Figma y se pasa a código con handoff vía el MCP de Figma.
3. Va en su propia rama, con un PR y su preview de Vercel. Opcionalmente se prueba en `dev`, luego se hace squash a `main`.
4. Se mide después de salir a producción: Core Web Vitals, peso de JS, páginas vistas.

**Fuentes de verdad**
- **Marca:** `alan-brand-guidelines.md` §14 (v1.1), que define color, tipografía, composición y movimiento.
- **Design system del portafolio:** `docs/design-system.md` (v0.1), con los tokens, las reglas de uso y las convenciones de CSS Modules. No es un producto aparte; vive aquí y crece con la migración.

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
  - [x] Crear el archivo de Figma (ver [Setup de Figma](#setup-de-figma)).
  - [x] Crear `src/styles/tokens.css` con los tokens **de la marca**. Se importa en `layout.tsx`, pero nada los usa todavía, así que no cambia nada visible.
  - [x] Crear las variables y estilos de texto en Figma con los mismos nombres: colecciones `Primitives`, `Semantic` (modo `Dark`), `Spacing`, `Radius` y `Motion`, más 12 estilos de texto.
  - [x] Crear la carpeta `src/ui/` (piloto T0).
  - [x] Registrar la línea base: Lighthouse móvil de `/`, `/about` y `/work/project-helix` y peso de JS (ver [Línea base](#línea-base-y-resultados)). Las CWV de usuarios reales se revisan en Speed Insights.
- **Listo cuando:** la línea base está anotada al final de este documento.

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

### I3 · Identidad base: solo oscuro y fuentes de marca (M)
- **Hipótesis:** aplicar ya la paleta y las fuentes de la marca a todo el sitio, aunque los componentes sigan siendo de Once UI, hace que el portafolio se reconozca como pieza de autor desde temprano. Lo validaremos cuando el sitio pase el filtro de sello (§15 de la marca) en una revisión con capturas.
- **Pasos:**
  - Sitio **solo oscuro**: quitar `ThemeToggle` y fijar el tema. Los visitantes ya no podrán elegir el modo claro.
  - Mapear las variables de color de Once UI (`--page-background`, `--neutral-*`, `--brand-*`, `--accent-*`) a los tokens de marca en un solo archivo de puente, que se borra en I7.
  - Cargar las fuentes de la marca en lugar de Figtree y Azeret Mono:
    - **Geist Sans y Geist Mono con el paquete oficial `geist`** (`geist/font/sans` y `geist/font/mono`), que las carga como archivo local: el build ya no las descarga de Google Fonts ni depende de la caché de Vercel. Reemplaza el `next/font/google` que agregó T0 en `src/styles/fonts.ts`, manteniendo las variables `--font-geist-sans` y `--font-geist-mono`.
    - **Newsreader** sigue con `next/font/google` (`--font-newsreader`), porque `geist` no la incluye.
    - **Aprendizaje de T0 (2026-10-02):** el primer deploy de producción con Geist vía `next/font/google` falló con `next/font/google queries have exactly one entry`. Vercel restauró una caché de build anterior que no tenía la fuente nueva, y Turbopack no pudo resolverla. El mismo commit compiló bien en el preview y en `dev`, y un redeploy lo resolvió. Si se repite con Newsreader u otra fuente de Google, **se vuelve a desplegar el mismo commit**, sin cambiar código.
  - Reemplazar `react-icons` por **Iconoir** en la interfaz y **Simple Icons** en los logos (ver `docs/design-system.md` → *Iconografía*), y desinstalar `react-icons`.
  - Quitar `DataThemeProvider`, `LayoutProvider`, `IconProvider` y `ToastProvider`. Para el aviso de "copiado" de `HeadingLink` basta un mensaje con `aria-live`.
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

## Primera prueba: T0 · `Tag` (antes de I0 completo)

Antes de diseñar todas las foundations, probamos el ciclo completo **Figma → handoff → código → preview** con el componente más chico del sitio: el `Tag` de las habilidades de About (ícono + texto, sin interacción, se usa en un solo archivo).

- **Hipótesis:** si el ciclo funciona con un componente chico (nombres de variables 1:1 con el código, lectura del frame vía MCP, implementación fiel), podemos escalarlo al resto sin retrabajo.
- **Lo validaremos cuando:**
  - el `Tag` del preview coincida con el frame de Figma;
  - todos los valores salgan de variables existentes, sin valores sueltos;
  - el ciclo completo tome una sesión o menos.

**Resultado (2026-10-02) · implementado en `src/ui/Tag`**
- **Lectura vía MCP:** `get_design_context` + `get_variable_defs` sobre el set `Tag` (19:29) devolvieron los nombres de variables idénticos a `tokens.css` (`--color-bg-elevated`, `--color-text-secondary`, `--space-4`, `--space-8`, `--radius-pill`). No hubo traducción.
- **Fidelidad:** medida en el navegador sobre la build, alto 32/28, padding 4/8, gap 8, radio 999, Geist Medium 14/20 y 12/16, ícono 22 y 20 y colores `#20262D` / `#8C96A3`. Todo coincide con Figma.
- **Valores fuera de tokens:** solo las dimensiones propias del componente (alto 32/28 e ícono 22/20), declaradas como variables locales (`--tag-height`, `--tag-icon-size`).
- **Fricción encontrada:**
  1. Las variables de texto tenían alcance solo `TEXT_FILL`, así que no se podían usar en íconos. Ya incluyen trazo y relleno de formas.
  2. Al cambiar el color de una instancia por script, Figma guardó un valor de respaldo negro; hay que escribir el valor resuelto como respaldo.
  3. Los logos de Simple Icons traen un `<title>` que duplica el texto y muestra un tooltip; en el Tag se pasa `title=""`.
  4. El diseño original era interactivo; se separó en `Tag` (informativo) y `Chip` (interactivo).
- **Pendiente de la retro:** tu comparación visual del preview contra el frame.

**Lo que diseñas tú en Figma.** Las variables y los estilos de texto ya existen en `01 Foundations`; solo usa esos.
1. **Componente `Tag`** en `02 Components`, con:
   - la propiedad `size` (`s`, `m`);
   - el booleano `showIcon` y un *instance swap* `icon`;
   - el texto `label`.
   - Úsalo con `System/Label S` o `Label M`, fondo `color/bg/elevated` o `surface`, texto `color/text/secondary` o `primary`, `radius/control` y padding `space/4` + `space/8`, según tu criterio. **Sin Cerezo**, porque el tag no es interactivo.
2. **Handoff:** en `05 Handoff`, en la sección **"T0 · Tag"**, pon instancias en ambos tamaños, con y sin ícono, y márcala **Ready for dev**. Me mandas su link.

**Lo que hago yo**
- Leer el frame y las variables con el MCP.
- Crear `src/ui/Tag/` con CSS Modules y los tokens que ya existen.
- Conectar con `next/font` las fuentes que use el tag.
- Reemplazar el `Tag` de Once UI en About.
- Abrir un PR con su preview y comparar con Figma.
- Hacer una retro corta: qué fricción hubo y qué ajustamos a las convenciones.

## Qué necesito que diseñes, por incremento

Marca cada componente en `05 Handoff` como **Ready for dev** cuando esté listo. Para cada uno incluye sus estados (hover, focus visible, pressed y disabled cuando aplique) y, si es un bloque de página, su versión mobile (390) además de desktop (1280). **Solo modo oscuro.**

### I0 · Foundations (`01 Foundations`)
Ya salen de la marca y están creadas en Figma y en código; ver `docs/design-system.md`.
- [x] Color: `Primitives` (paleta de marca) y `Semantic` (modo `Dark`).
- [x] Espaciado (4, 8, 16, 24, 32, 48, 64), radios (`control`, `card`, `pill`) y motion.
- [x] Estilos de texto v0.1: `Voice/*` en Newsreader, `System/*` en Geist y `Measure/Meta` en Geist Mono.
- [ ] **Validar la escala tipográfica v0.1**: ajústala en Figma si algo no te convence y me avisas para pasar el cambio a código.
- [ ] **Grid bento:** columnas y comportamiento en 390, 768 y 1280, con colapso a una columna en mobile.

### I1 · Poda
- Nada que diseñar.

### I2 · Primitivas
- [ ] `Divider` (horizontal y vertical, `subtle` y `strong`).
- `Stack`, `Grid`, `Text` y `Heading` salen de los tokens y text styles de I0; no necesitan componente propio.

### I3 · Identidad base
- Nada que diseñar: es aplicar los tokens y las fuentes de la marca. Solo revisas capturas del preview contra el filtro de sello.

### I4 · El marco del sitio
- [ ] `Button`:
  - `variant`: primary, secondary, tertiary, ghost;
  - `size`: s, m, l;
  - ícono opcional al inicio y al final;
  - todos los estados.
- [ ] `IconButton`: los mismos tamaños y variantes, con tooltip.
- [ ] `ToggleButton`: los ítems de navegación, seleccionado y no seleccionado.
- [ ] `Link`: inline y suelto, con sus estados.
- [ ] `Avatar` (s, m, l) y `AvatarGroup`.
- [ ] `Badge` y `Tag`, retomando el de T0.
- [ ] `Header`: desktop y mobile, con el ítem activo y la hora y ubicación (sin ThemeToggle: el sitio es solo oscuro).
- [ ] `Footer`.

### I5 · Casos de estudio
- [ ] `ProjectCard`: con y sin media, hover y foco.
- [ ] **Plantilla de caso de estudio:**
  - hero con título, rol, fechas y equipo;
  - secciones contexto → problema → rol → proceso → resultados → aprendizajes;
  - bloque de métricas.
- [ ] **Bloques MDX:**
  - `Table`, `CodeBlock`, `Accordion` y `List`;
  - `Callout` (info, success, warning, danger);
  - `Media`, imagen o video con pie, en ratios 16:9, 4:3 y 1:1;
  - `Carousel`, el índice de encabezados y `HeadingLink`.

### I6 · Home y About
- [ ] **Home:**
  - hero con la propuesta de valor;
  - casos destacados;
  - CTA a contacto y CV.
- [ ] **About:**
  - intro;
  - experiencia en línea de tiempo;
  - estudios;
  - habilidades con tags;
  - contacto y redes.
- [ ] Página **404**.

### I7 · Cierre
- [ ] Plantilla de **imagen OG** (1200×630) para compartir en redes.

## Setup de Figma

Archivo: **[PDS · Portfolio Design System](https://www.figma.com/design/DuBGDnVdxcqR7ON3zyzbBL)**, en tu equipo Pro. Ya tiene creadas las páginas de abajo.

| Página | Contenido |
|---|---|
| `00 Cover` | Estado del sistema y changelog |
| `01 Foundations` | Variables y estilos de texto |
| `02 Components` | Componentes con variantes |
| `03 Patterns` | Bloques de caso de estudio, hero, listas de proyectos |
| `04 Pages` | Pantallas completas (desktop 1280 y mobile 390) |
| `05 Handoff` | Secciones marcadas **Ready for dev** |

**Variables**
- La colección `Primitives` guarda las escalas de color, espacio, radios y tamaños tipográficos.
- La colección `Semantic` tiene un solo modo, `Dark`: `color/bg/page`, `color/bg/surface`, `color/text/primary`, `color/accent/default`, etc. Las colecciones `Spacing`, `Radius` y `Motion` completan los tokens.
- En cada variable define **Code syntax → Web** con el nombre CSS (`--color-bg-surface`). Así `get_variable_defs` devuelve exactamente lo que va en `tokens.css`.

**Tipografía:** la de la marca, con Geist Sans para el sistema, Newsreader para la voz y Geist Mono para la medida. El sitio todavía usa Figtree y Azeret Mono hasta I3.

**Estado (2026-10-02):** las variables y los estilos de texto ya están creados a partir de la marca. En `01 Foundations` hay muestras de color y tipografía conectadas a ellos.

**Handoff:** el flujo está en `CLAUDE.md` → *Figma → Code Handoff*. En corto: marcas *Ready for dev*, me pasas el link del frame con `node-id` y lo implemento en una rama con PR.

**Code Connect:** hasta donde sé, requiere plan Organization o Enterprise de Figma. Mientras tanto, el mapeo vive en la tabla de abajo. Con Code Connect activo, el MCP lo usaría automáticamente.

## Mapeo Figma ↔ código

| Componente en Figma | Código | Reemplaza a | Incremento | Estado |
|---|---|---|---|---|
| `Tag` (19:29) | `src/ui/Tag` | `Tag` | T0 | **hecho** |
| `Chip` (11:12) | `src/ui/Chip` | — | Cuando haya filtros | solo Figma |
| `Icon/*` · `Logo/*` | `iconoir-react` · `@icons-pack/react-simple-icons` (mapa en `src/resources/tagIcons.tsx`) | `react-icons` | T0 (skills) · I3 (resto) | en curso |
| `Stack` | `src/ui/Stack` | `Column`, `Row`, `Flex` | I2 | pendiente |
| `Text` / `Heading` | `src/ui/Text`, `src/ui/Heading` | `Text`, `Heading` | I2 | pendiente |
| `Button` | `src/ui/Button` | `Button`, `IconButton` | I4 | pendiente |
| `Header` / `Footer` | `src/components/Header`, `Footer` | `Header`, `Footer` actuales | I4 | pendiente |
| `ProjectCard` | `src/ui/ProjectCard` | `ProjectCard` actual | I5 | pendiente |

## Línea base y resultados

Esta tabla se llena en I0 y se actualiza al cerrar cada incremento.

Medición: Lighthouse 12, **móvil**, una corrida por página sobre `alancisneros.design` (commit `8f658b8`, con T0 ya publicado). Lighthouse es una medición de laboratorio: los números varían entre corridas, así que se comparan tendencias, no décimas. Las Core Web Vitals de usuarios reales (incluido INP) se revisan en Vercel Speed Insights.

| Fecha | Incremento | Página | Perf | LCP | CLS | TBT | JS transfer | A11y | Notas |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-02 | I0 | `/` | 60 | 4.16 s | **0.225** | 540 ms | 453 kB | 96 | LCP = imagen del proyecto con `loading="lazy"`; CLS = el footer se desplaza (0.213) |
| 2026-10-02 | I0 | `/about` | 82 | 4.14 s | 0.000 | 34 ms | 453 kB | 96 | LCP = bloque de introducción |
| 2026-10-02 | I0 | `/work/project-helix` | 66 | 3.90 s | **0.214** | 449 ms | 452 kB | 92 | LCP = imagen con `width=0 height=0`; CLS = footer (0.213) |

**Lectura de la línea base**
- **Fuera del presupuesto** (`CLAUDE.md` → *Design Principles*: CLS < 0.1, LCP < 2.5 s):
  - CLS en `/` y en el caso de estudio;
  - LCP en las tres páginas.
- **Hipótesis para incrementos futuros** (no se corrigen en I1 para no mezclar cambios):
  - **LCP:** la imagen principal se carga de forma diferida. En I5 (`ProjectCard` y caso de estudio) e I6 (Home), cargarla con prioridad y con dimensiones reales.
  - **CLS:** el footer se mueve porque el contenido de arriba crece tarde. Sospechosos: imágenes sin dimensiones (`width=0 height=0`) y `RevealFx`. Se resuelve en I5 e I6.
  - **JS:** unos 450 kB en todas las rutas, casi todo de Once UI y del layout compartido. Debería bajar con I1 (poda), I2 (primitivas) e I7 (quitar Once UI).
