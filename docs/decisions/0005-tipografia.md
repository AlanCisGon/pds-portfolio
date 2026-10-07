# 0005. Tipografía: Host Grotesk, Amstelvar y Chivo Mono

- **Estado:** aceptada
- **Fecha:** 2026-10-06
- **Decidió:** Alan

## Contexto

- El SDS usaba Geist Sans para la interfaz, Newsreader para la voz y Geist Mono para la medida.
- Alan decidió una triada nueva para el Somara Design System (ADR 0004). La implementan Tenoch en código y Clara en Figma, en paralelo.
- El razonamiento original de Alan usaba la metáfora del taller (madera, calibrador, aluminio). Esa metáfora rectora está en revisión (propuesta de Ameyali sobre "carpintero de lo digital"). Por eso este ADR justifica cada fuente por su **función** y no por la metáfora: la decisión se sostiene salga lo que salga de esa revisión.

## Decisión

| Rol | Antes | Ahora | Función |
|---|---|---|---|
| Interfaz (`System/*`, `--font-sans`) | Geist Sans | **Host Grotesk** | Cada letra mide lo mismo en todos los pesos (el texto no reacomoda la línea al cambiar de peso); legible en 12 a 16 px y neutra para no competir con la voz. |
| Voz (`Voice/*`, `--font-serif`) | Newsreader | **Amstelvar v1.000** | Serif variable con tamaño óptico (8–144): un solo archivo para titulares y citas. Tiene itálica real para `quote`. |
| Medida (`Measure/*`, `--font-mono`) | Geist Mono | **Chivo Mono** | Monoespaciada para cifras, metadatos y código; mismo ancho de carácter que Geist Mono, así que la retícula no cambia. Viene de Omnibus-Type (Buenos Aires). |

- **Versión de Amstelvar:** el release v1.000 (abril de 2026) de `googlefonts/amstelvar-beta`, con licencia OFL 1.1. La AmstelvarAlpha de 2017, que es la que tiene Figma, **no tiene los acentos del español** y no se usa.
- Tamaños, interlineados, pesos y nombres de estilos no cambian.

## Consecuencias

- **Rendimiento:** Amstelvar se sirve como un subconjunto latino con solo los ejes `wght` (300–700) y `opsz`: 75 KB la romana y 78 KB la itálica, que no se precarga. Pesaba 1.4 MB con sus 12 ejes. Host Grotesk y Chivo Mono llegan por `next/font/google`.
- **Imagen OG:** usa TTF estáticos en `src/assets/og/`.
- **Dependencias:** sale el paquete `geist`.
- **Figma:** los estilos `System/*` y `Measure/*` ya usan Host Grotesk y Chivo Mono; Clara los revisó y corrigió los textos sueltos. Los estilos `Voice/*` quedan bloqueados hasta que Alan instale Amstelvar v1.000 en su equipo, porque Figma solo tiene la versión alfa, sin acentos.
- **Guía de marca:** §14 nombra las fuentes anteriores y solo Alan la edita. Ameyali propuso una redacción por función para que Alan la revise.
- **Reversible:** cambiar una familia es cambiar `src/styles/fonts.ts` y las tres variables `--font-*`. Clara propone crear también variables de familia en Figma para que el próximo cambio sea un solo valor.
