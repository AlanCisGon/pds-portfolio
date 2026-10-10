# 0006. Somara Studio, versión con cinco agentes

- **Estado:** aceptada
- **Fecha:** 2026-10-10
- **Decidió:** Alan

## Contexto

- Alan pidió un animador. Julieta hizo el discovery y encontró que el hueco no era de criterio sino de oficio: nadie prototipaba ni sentía el movimiento. Recomendó un especialista revisado por Clara.
- Clara estuvo a favor con dos condiciones: que la colección `Motion` tuviera un solo dueño y que hubiera momentos firma reales.
- Alan definió el movimiento en una entrevista: con peso, aceleración y fluidez; memorable cuando deleita e invisible cuando es lo esperado; nada sin propósito ni lento.
- El nombre salió de la ronda de naming de Ameyali. Alan eligió Félix, del latín *felix*, con un guiño a Felix the Cat, de Otto Messmer, porque quería un nombre que sonara latino.

## Decisión

Se suma **Félix**, quinto agente, animador y especialista en microinteracciones. Somara Studio conserva su nombre (ADR 0003): esta es su **segunda formación**, un incremento de producto y no un rebranding.

- **Rol:** prototipa el movimiento expresivo en Figma y CSS de referencia, siempre con su versión para movimiento reducido. No edita el repositorio y solo lo invoca Tenoch.
- **Orden:** palabras (Ameyali) → forma (Clara, luego Félix) → código (Tenoch).
- **Frase:** "Si no tiene razón, no se mueve."
- Se aprobó por PR, según el ADR 0002.

## Reparto con Clara

- **De Félix:** el movimiento expresivo: la microinteracción firma, los momentos firma, el pico de cada flujo y las transiciones que explican un cambio de estado.
- **De Clara:** el movimiento productivo, la colección `Motion` y los estados de los componentes. Además revisa todo lo de Félix.
- Una curva o duración nueva solo existe si Clara la vuelve token y Alan la aprueba.

## Riesgos aceptados

- Más traspasos: cada pieza con movimiento suma una revisión de Clara.
- Tentación de mover de más. El contrapeso es su propia regla: si no tiene razón, no se mueve; y si duda, quita.
- La excepción del rebote (la confirmación de copiar del CodeBlock) puede leerse como permiso general. No lo es: es la única, y la aprobó Alan.
- Las líneas en inglés del caso llevan [REVISIÓN NATIVA PENDIENTE].

## Consecuencias

- Su primer trabajo: la página de Motion en Figma con tres demos (el indicador del NavItem, la confirmación de copiar del CodeBlock y el FeaturedCase al tocar), llevadas al catálogo de componentes.
- El caso de estudio, la narrativa del equipo y la formación nombran a cinco agentes.
- **Reversible:** si en dos ciclos Félix no aporta momentos firma que Alan apruebe, se retira con un ADR que reemplace a este. Clara conserva todo el movimiento y nada de lo construido se pierde.
