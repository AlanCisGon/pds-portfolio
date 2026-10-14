# 0008. Escala de breakpoints de 576 a 1400

- **Estado:** aceptada
- **Fecha:** 2026-10-14
- **Decidió:** Alan

## Contexto

- El sistema tenía tres anchos de referencia (390, 768 y 1280), pero el código usaba 768 y 1024, y 1024 no estaba documentado.
- Sin una escala con nombre, cada componente elegía su corte.

## Decisión

- Escala mobile first con seis rangos: `xs` < 576, `sm` ≥ 576, `md` ≥ 768, `lg` ≥ 992, `xl` ≥ 1200 y `xxl` ≥ 1400.
- Viven como tokens de referencia en `src/styles/tokens.css` (`--breakpoint-sm` … `--breakpoint-xxl`); en los media queries se escribe el número literal.
- `max-width` usa el límite menos 1 px.
- Los cortes de 1024 pasan a 992 (`lg`). 768 se queda.
- La revisión de fidelidad sigue en 390 y 1280 (ADR 0007).

## Consecuencias

- Entre 992 y 1023 px, Home, About y los casos de estudio ya muestran el layout de escritorio.
- `sm`, `xl` y `xxl` existen pero ningún componente los usa todavía; se adoptan cuando un diseño lo pida.
- Clara refleja la escala en Figma.
- **Reversión:** barata; es un PR de CSS y docs.
