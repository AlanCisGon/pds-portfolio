# alancisneros.design

Portafolio personal de Alan Cisneros, Product Experience Strategist: casos de estudio, experiencia y enfoque de diseño.

En vivo: https://alancisneros.design

## Stack

- **Next.js 16** (App Router) + **React 19** + TypeScript estricto, desplegado en **Vercel**.
- **Sistema de diseño propio** en `src/ui`: componentes con CSS Modules sobre tokens (`src/styles/tokens.css`), diseñados en Figma. Solo tema oscuro. Inventario y decisiones en [`docs/design-system.md`](docs/design-system.md).
- **Tipografía:** Geist Sans y Geist Mono (paquete `geist`).
- **Íconos:** Iconoir y Simple Icons.
- **Contenido:** casos de estudio en MDX (`src/app/work/projects/*.mdx`, vía `next-mdx-remote`) y textos en `src/resources/content.tsx`.
- **SEO:** Metadata API de Next y JSON-LD propios (`src/utils/seo.tsx`), sitemap y robots generados, imagen Open Graph de marca (`/api/og/generate`).

## Desarrollo

```bash
npm install
cp .env.example .env.local   # LAB_USER / LAB_PASSWORD para probar /lab
npm run dev                  # http://localhost:3000
npm run build && npm run start
```

- Configuración del sitio: `src/resources/site.config.ts` (URL canónica, rutas, datos del Header).
- Catálogo privado de componentes: `/lab/ui` (detrás de Basic Auth).

## Historia

El proyecto empezó como un fork de la plantilla [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) de Lorant One, construida con Once UI. Entre el 2 y el 3 de octubre de 2026 se migró por incrementos a un sistema de diseño propio; ya no depende de Once UI. El registro de la migración está en [`docs/migration-plan.md`](docs/migration-plan.md).

## Créditos y licencia

Gracias a Lorant One ([Threads](https://www.threads.net/@lorant.one) · [LinkedIn](https://www.linkedin.com/in/lorant-one/)) por [Magic Portfolio](https://github.com/once-ui-system/magic-portfolio) (CC BY-NC 4.0), el punto de partida de este repositorio. Desde octubre de 2026 el código está reescrito por completo y ya no incluye piezas de la plantilla. La licencia vigente está en [`LICENSE`](LICENSE).
