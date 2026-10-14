# 0009. Pantallas grandes: escala fluida con tope

- **Estado:** aceptada
- **Fecha:** 2026-10-14
- **Decidió:** Alan (propuesta de Clara, implementación de Tenoch)
- **Complementa:** ADR 0008 (breakpoints)

## Contexto

- En la demo del 13 de octubre, en una tele 4K, el sitio no se adaptaba: tipo de laptop y contenido en una columna de 1080 px.
- Subir el `max-width` por breakpoint ensancha la caja, pero deja el tipo chico y obliga a un corte por dispositivo.

## Decisión

- Hasta 1440 px el sistema es fijo, como antes.
- Por encima, el tipo de lectura (display, title, heading, body), el padding de página, el inset del hero y el ancho de contenido crecen con el viewport (base × vw/1440), hasta ×1.75 (~2520 px).
- Tokens nuevos: `--content-max`, `--measure-prose` (40 × body-l: 720 px hasta 1440) y `--hero-inset`.
- La prosa nunca supera `--measure-prose`, así que los caracteres por línea no cambian al crecer.
- Label y meta crecen hasta ×1.25 (meta 15 px, label M 17.5 px), para leerse a distancia de sala (Alan, a propuesta de Clara).
- Lo que no escala: código, cifras, quote, card, controles y Header. Header y `Button` fijan localmente sus tokens de label y meta (Alan: "menú fijo").
- En 4K al 100% el contenido llega a la mitad del ancho; Alan decidió que basta. Escalar la raíz queda como plan B.
- `xl` y `xxl` siguen como referencia: la regla no necesita cortes nuevos.

## Consecuencias

- 390, 1280 y 1440 se ven idénticos a antes (medido con Playwright contra producción).
- En 1920, el H1 mide unos 75 px y el contenido 1440. En 2560 y más, el H1 mide 98 y el contenido 1890.
- **Reversión:** barata; se restauran los valores fijos en `tokens.css`.
