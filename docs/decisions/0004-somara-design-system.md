# 0004. Nombre del design system: Somara Design System (SDS)

- **Estado:** aceptada
- **Fecha:** 2026-10-06
- **Decidió:** Alan

## Contexto

- El sistema nació como *PDS · Portfolio Design System*, un nombre descriptivo de cuando era la migración de una plantilla.
- Hoy tiene 27 componentes diseñados en Figma y en código, tokens compartidos 1:1, un catálogo, pruebas de UI (#42) y un equipo con nombre propio (ADR 0003).
- Alan considera que ya merece nombre propio y que debe ser el del equipo que lo mantiene.

## Decisión

El design system se llama **Somara Design System**, abreviado **SDS**.

- **Uso:** "Somara Design System" la primera vez y en títulos; "SDS" después.
- **Alcance del cambio** (puerta de dos vías):
  - el nombre del archivo de Figma (`DuBGDnVdxcqR7ON3zyzbBL`; el `fileKey` y los `node-id` no cambian);
  - `docs/` y los comentarios de código que lo nombran;
  - el contador CSS interno `pds-list` pasa a `sds-list`.
- **Lo que no cambia:**
  - el repositorio `pds-portfolio` y el proyecto de Vercel. Renombrarlos rompe enlaces, previews e integraciones, y quien visita el sitio no los ve: no vale el costo;
  - los nombres de tokens (`--color-*`, `--space-*`…), que no llevan prefijo;
  - `src/ui` como carpeta.

## Consecuencias

- **Integridad:** equipo y sistema comparten nombre. La serie de Somara en el blog (#88) puede contar el sistema como obra del equipo.
- Si el SDS se usa algún día en otros productos, el nombre ya no lo ata al portafolio.
- **Riesgo aceptado:** "SDS" también es la sigla de *Safety Data Sheet*. En contexto de diseño no se confunde, y la primera mención siempre lleva el nombre completo.
- **Pendiente:** la misma revisión formal de marca que el ADR 0003 deja abierta (IMPI y USPTO), si el nombre llega a usarse como servicio.
