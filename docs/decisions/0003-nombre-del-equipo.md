# 0003. Nombre del equipo: Somara Studio

- **Estado:** aceptada
- **Fecha:** 2026-10-05
- **Decidió:** Alan

## Contexto

- El equipo de cuatro agentes de IA (Tenoch, Clara, Ameyali y Julieta) no tenía nombre. Alan lo necesita para el proyecto de GitHub, el colofón del sitio (#65) y el caso de estudio sobre cómo se construyó el portafolio.
- Hubo cuatro rondas (ver `docs/calibracion/0001-nombre-del-equipo.md`). La primera se rechazó por literal y dio pie a la gobernanza del criterio (ADR 0002) y al método de naming de Ameyali (#74).
- **Restricciones de Alan:**
  - el nombre es solo de los agentes, no lo incluye a él;
  - no lleva su apellido;
  - nada de origen taurino;
  - el mismo nombre debe funcionar en inglés y en español;
  - se revisan marcas y dominios antes de decidir.

## Decisión

El equipo se llama **Somara Studio**.

- **Construcción:** neologismo por sonido, sobre "somos". No necesita explicarse para funcionar.
- **Pronunciación:** "so-MÁ-ra" en español y "suh-MAR-uh" en inglés.
- **Uso:** "Somara Studio" en títulos y en el colofón; "Somara" a secas en conversación.

## Revisión antes de decidir (2026-10-05)

- **Dominios:**
  - `somara.team`: libre.
  - `somara.studio`: estacionado (redirige a `/lander`) y probablemente en venta.
  - `somara.com`: tomado y sin sitio activo.
  - No se compró ninguno: el nombre vive en alancisneros.design.
- **Marcas:** la búsqueda web no encontró ningún estudio, empresa ni marca "Somara" en diseño, software ni IA. Lo más cercano es "SOMAR", una marca de ropa en la USPTO, de otro sector. **[EVIDENCIA PENDIENTE]:** falta una búsqueda formal en el IMPI y la USPTO (clases 42 y 41) si el nombre llega a usarse como servicio.

## Riesgos aceptados

- Suena a nombre de mujer y puede leerse como un quinto agente junto a Clara y Julieta. El colofón lo deja claro al nombrar a los cuatro.
- En inglés se acerca a Samara, el personaje de *The Ring*.
- Las líneas en inglés del colofón y del caso llevan [REVISIÓN NATIVA PENDIENTE] hasta su revisión.

## Consecuencias

- El proyecto de GitHub #1 se llama "Somara Studio".
- El colofón (#65) y el caso de estudio del equipo usan este nombre. Los textos los escribe Ameyali.
- Cambiar el nombre requiere un ADR nuevo que reemplace a este.
