# 0001. Idiomas del sitio y del equipo

- **Estado:** aceptada
- **Fecha:** 2026-10-05
- **Decidió:** Alan

## Contexto

- El §16.1 de las guías de marca pide español de México salvo que se pida otro idioma. En la entrevista del 2026-10-04 (`docs/content-audit.md`), Alan confirmó el inglés para el portafolio como excepción.
- El sitio declara `lang="en"` sin variedad. Ameyali no sabe qué ortografía ni qué formatos usar, y Tenoch no sabe qué locale pasar a `Intl`.
- Los textos de accesibilidad de `src/ui` siguen en español porque los textos que viven en el código no tenían dueño.
- Ameyali marca [REVISIÓN NATIVA PENDIENTE] y [EVIDENCIA PENDIENTE], pero no estaba definido qué pasa con esas marcas al pedir un merge.

## Decisión

1. **Sitio y blog:** inglés estadounidense (en-US). `lang="en-US"`; fechas, números y monedas con `Intl` en `en-US`; ortografía de Merriam-Webster.
2. **Equipo:** español de México en las conversaciones con Alan, las descripciones de PR, los ADR, `docs/` y los comentarios de código.
3. **Código:** inglés en nombres, tipos, rutas y mensajes de commit. Como el merge es squash, el título del PR también va en inglés, porque se convierte en el commit.
4. **Textos en el código:** todo lo que lee o escucha quien visita (texto visible, de accesibilidad, `alt`, metadatos, errores) es de Ameyali. Tenoch no lo escribe dentro de los componentes: lo expone como prop o en un archivo de textos, y Ameyali lo escribe o lo revisa.
5. **Marcas pendientes:** si un PR lleva una marca [REVISIÓN NATIVA PENDIENTE] o [EVIDENCIA PENDIENTE] sin resolver, Tenoch la señala al pedir la aprobación del merge. Alan decide si se espera o se publica así, y la decisión queda en la descripción del PR.
6. **Internacionalización futura:** Tenoch implementa la estructura (rutas por idioma, `hreflang`, `Intl` por locale, textos por idioma) y Ameyali escribe cada idioma desde cero. Tenoch nunca traduce, ni siquiera de forma provisional.

## Consecuencias

- Tenoch cambia `lang="en"` por `lang="en-US"` y revisa los formatos de fecha.
- Se cierra el pendiente de `docs/content-audit.md`: Tenoch convierte los textos de accesibilidad de `src/ui` en props y Ameyali escribe su versión en inglés.
- En el sitio, Ameyali ya no pregunta la variedad: usa su voz en-US.
- Cambiar de variedad o sumar un idioma requiere un ADR nuevo que reemplace a este.
