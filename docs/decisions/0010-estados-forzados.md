# 0010. Estados forzados para documentar el SDS con el código vivo

- **Estado:** aceptada
- **Fecha:** 2026-10-17
- **Decidió:** Alan (apuesta B; implementación de Tenoch)

## Contexto

- Alan pidió que cada página de `/lab/ui` se parezca a su spec de la página **06 Specs** de Figma: anatomía, medidas, tokens por parte, props, estados, 390 y 1280 px, y accesibilidad.
- La matriz de estados de Figma (variante × Default/Hover/Pressed/Focus/Disabled) no se puede dibujar con el código vivo: `:hover`, `:active` y `:focus-visible` no se fuerzan desde HTML.
- Había dos caminos:
  - **A:** imágenes exportadas de Figma. Es barato, pero muestra Figma, no el código.
  - **B:** forzar los estados en el código. Es la verdad de producción y toca `src/ui`.
- Alan eligió B (2026-10-17).

## Decisión

- Cada regla de `src/ui` con `:hover`, `:active` o `:focus-visible` lleva un gemelo en la misma lista de selectores: `:where([data-sds-state="hover|pressed|focus"]) .clase`.
  - `:where()` no suma especificidad.
  - El atributo solo existe en el lab, dentro de las celdas de la matriz, así que en producción el selector nunca coincide.
- Disabled no se fuerza: es una prop.
- `npm run lint` corre `scripts/check-forced-states.mjs`. Falla si una regla con pseudo-estado no tiene su gemelo.
- La spec de cada componente vive en:
  - `src/app/lab/ui/docs/figma-specs.ts`, extraída de Figma con un script de solo lectura. Figma es la fuente: si una spec cambia, se vuelve a extraer.
  - `src/app/lab/ui/docs/specimens.tsx`, con las props de cada celda.
- La anatomía pone los marcadores de Figma sobre el render vivo y mide alto y ancho en el navegador. Si no coinciden con el ejemplo de Figma, es deriva y se le reporta a Clara.

## Consecuencias

- **Costo en producción:** unos cientos de bytes de CSS con selectores que nunca coinciden. No hay JS.
- Agregar un estado a un componente obliga a escribir su gemelo; el lint lo recuerda.
- La página detecta deriva sola: los tokens que Figma nombra y el CSS no usa se marcan en la sección "Tokens leídos del código".
- **Reversión:** borrar los gemelos (`:where([data-sds-state…])`) y el script. Es una puerta de dos vías.
- **Fuera de alcance:** estados internos que no son CSS ("Copied" de CodeBlock, el activo del TOC por scroll). En la matriz se ven en su estado por omisión.
