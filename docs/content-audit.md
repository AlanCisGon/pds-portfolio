# Auditoría de contenido vs. marca (2026-10-03)

Fuente de verdad: `brand_guidelines/alan-brand-guidelines.md` (las referencias § son a ese documento) y los principios Lean UX de `CLAUDE.md` (proto-personas y estructura de caso de estudio). Auditoría de solo lectura sobre `main`; ningún texto se cambió todavía. **No se inventan cifras:** lo que falta queda como pregunta.

## Resumen

El sitio refleja la marca **a medias**. El fondo sí coincide: la evidencia de Helix, el foco en el problema real y las industrias. La voz no: domina la jerga corporativa de CV ("Strategic UX & Service Design Leader", "exceptional digital experiences", "data-driven design operations"). Eso choca con §13 (concreta, historias antes que adjetivos) y con §12 (nunca genérica). Tampoco aparecen la bandera del balance entre negocio, tecnología, producto y diseño, ni la forma de trabajar (§6).

**Top 3**
1. **Rol inconsistente:** hay 6 títulos distintos y ninguno es el de §1. La ubicación sale como `America/Mazatlan` en lugar de Culiacán.
2. **Métricas inconsistentes o infladas:**
   - la conversión aparece como "+12% est." en About y como "+2pp" en Helix;
   - el NPS está expresado en "pp";
   - frases como "doubled", "fully inclusive" y "all KPIs" chocan con una conversión en app que solo se mantuvo (§6, §12, §16.3).
3. **Casos de estudio incompletos:**
   - a Helix le faltan proceso, rol detallado y aprendizajes;
   - Movistar no tiene resultados medidos;
   - ambos casos se cuentan en clave individual (§13, §16.4).

## Hallazgos (severidad alta y media)

### Global
- **Alta · `content.tsx` `person.role`:** `" Product Experience Strategist"` lleva un espacio al inicio, que provoca dobles espacios en el SEO, y no es el rol de §1. → Definir un título canónico.
- **Alta · el rol cambia entre páginas:** "Product Designer & Strategist" (home.title), "product designer" (subline), "Strategic UX & Service Design Leader" (intro), "UX Design Lead", "UX Team Lead" (MDX) y "Product Experience Strategist". → Un título canónico para todo el sitio; el cargo de cada empresa va solo en Experience.
- **Alta · ubicación:** `America/Mazatlan` es la zona horaria, no la ciudad (§1: Culiacán, Sinaloa). → Separar `timeZone` de una etiqueta visible "Culiacán, Mexico".
- **Media · `src/ui/*`:** los textos de accesibilidad están en español y la página en inglés (`lang="en"`). → Pasarlos a inglés o hacerlos props.
- **Media · idioma:** §16.1 pide español de México "salvo que se pida otro idioma". → Confirmar el inglés para el portafolio.
- **Media · marca ausente:** no aparecen la bandera (§9), la forma de trabajar (§6: investigar pronto, prototipar rápido, probar en pequeño) ni el vocabulario propio (§13).

### Home
- **Alta · `home.subline`:**
  - es genérica y mezcla industrias con una disciplina ("User Research");
  - omite telecom aunque Movistar es uno de los casos;
  - "8+ years" no cuadra con la experiencia listada (2019 a hoy).
  - Propuesta: *"Product designer at Coppel, where I lead UX for Purchase & Payments. I've worked across e-commerce, financial services and telecom, and I start every project by understanding the real problem before designing the solution."*
- **Media · headline "Hi, I'm Alan":** no dice ni rol ni sello. → Usar la bandera: *"I design products that balance business, technology, product and design."*
- **Media · meta descriptions:** dobles espacios, texto genérico, la zona horaria en vez de la ciudad. → *"Product designer in Culiacán, Mexico. Case studies in e-commerce, financial services and telecom: cart and checkout at Coppel, app redesign at Movistar MX."*
- **Baja:**
  - el CTA dice "About – Alan Cisneros" porque reutiliza el título SEO, y no hay contacto directo en el hero;
  - "Cart & Checkout" en la Home frente a "Cart and Checkout" en el caso.

### About
- **Alta · intro:** jerga en tercera persona sin evidencia (§13, §16.2). Propuesta en primera persona: *"I'm a product designer based in Culiacán, Mexico. At Coppel I lead UX for Purchase & Payments; before that I was a UX researcher there, and I led design and research at Onikom Systems for clients like Movistar MX. My work sits between business, technology, product and design: I research early, prototype fast, test small and keep the customer at the center."*
- **Alta · logros de Coppel:**
  - "+12% est." contradice el "+2pp" de Helix;
  - "+25% up", "-60% down" y "+80% adoption" no dicen base, periodo ni fuente;
  - todos los verbos son individuales. → Formato *"[What the team did]: [metric] [period/source]"*.
- **Media:**
  - "UX metrics governance" es una lista de siglas sin resultado;
  - "Validation Onion" y "Contribution Process" son términos internos sin explicar;
  - la descripción de la habilidad de IA es genérica y sin evidencia, y las guías no fijan postura sobre IA (§16.8);
  - el cargo "UX Design Lead" no coincide con el "Coordinador de diseño" de la marca.
- **Baja:**
  - "Recurrent Shipping" → "Recurring Shipping";
  - "NextJS" → "Next.js";
  - "Gemini AI" → "Gemini";
  - títulos de sección con mayúsculas inconsistentes (Experience / Education / Skills);
  - "Bachelor's Degree - …" → "B.A. in …".

### Work
- **Media:**
  - `work.description` ("Design and dev projects…") es genérica;
  - "View project" no dice que lleva al sitio del cliente, no al proyecto. → "Live site" o "Visit coppel.com".
- **Baja:**
  - se mezclan Projects, Work y case study;
  - el "@" en los títulos se ve informal en SEO y OG.

### Project Helix
- **Estructura** (CLAUDE.md):
  - presentes: contexto y problema (sin cifras base) y resultado (sin base, periodo ni atribución);
  - débiles: el **rol** apenas se menciona y las **decisiones** son parciales;
  - faltan: el **proceso** y los **aprendizajes**.
- **Alta:**
  - el NPS aparece como "+0.13pp", una unidad incorrecta para una cifra casi nula;
  - frases exageradas: "substantial improvements across all KPIs", "Doubled efficiency", "Fully inclusive", "democratized access";
  - el contexto dice "(2H 2024)" pero `publishedAt` es 2024-05-20;
  - el equipo no tiene tamaño ni composición.
  - Reescritura posible sin datos nuevos: *"The redesign improved web conversion (+2 pp), app accessibility (+30 pp) and usability (+7 pp), while app conversion held steady despite higher traffic."*
- **Media:**
  - el problema no tiene cifras base;
  - errores: "an medium" y "dropped so much, excluding…";
  - el paso "reduced by 6 steps" no dice de cuántos partía;
  - ¿es "Helix" o "Elix" (§3, §18)?
- **Baja:**
  - "+2pp" → "+2 pp" y "It held" → "Held steady";
  - los alt dicen "A image…";
  - "for Purchase team @ Coppel" → "for the Purchase team at Coppel".

### Movistar MX
- **Alta:**
  - los resultados no tienen evidencia (§16.3). Si no se midió, decirlo: *"Results weren't measured after launch; what we validated in prototypes was…"*;
  - no menciona a Onikom ni al equipo, y el rol del caso no coincide con About.
- **Media:**
  - el proceso no tiene decisiones concretas;
  - "Less visible information leads to better decisions" es ambiguo → *"Showing less at once leads to better decisions."*
- **Baja:**
  - "responsabilities" → "responsibilities";
  - el alt del home screen tiene errores y un salto de línea;
  - el título lleva "@";
  - confirmar la fecha (2019).

### 404, footer, SEO y OG
- **Media:**
  - la imagen OG y el JSON-LD heredan el rol inconsistente;
  - falta `jobTitle` en el JSON-LD.
- **Baja:**
  - el footer "From 🇲🇽" lo lee el lector de pantalla como "flag: Mexico" → *"© 2026 Alan Cisneros · Culiacán, Mexico"*;
  - el 404 podría ser más generoso → *"This page doesn't exist or has moved. Start from the home page or browse the case studies."*

## Preguntas para Alan
1. ¿Cuál es tu título canónico en inglés? Y tu cargo oficial en Coppel: ¿Design Lead, Design Coordinator o UX Design Lead?
2. ¿Los "8+ years" incluyen experiencia anterior a 2019? Si es así, ¿cuál?
3. ¿Confirmas el inglés como idioma del sitio (frente a §16.1)?
4. Helix:
   - ¿es "Elix"?
   - periodo real del proyecto;
   - cifras base de conversión web y app, accesibilidad, SUM y NPS (con su escala);
   - número de pasos antes y después;
   - tamaño y composición del equipo;
   - investigación y pruebas que hicieron;
   - aprendizajes.
5. Coppel: ¿la conversión subió +12% est. o +2pp? Y para el ticket +25%, los rechazos −60% y la adopción +80%: ¿base, periodo y fuente?
6. Movistar: ¿hubo mediciones o feedback del cliente? ¿Cómo era el equipo en Onikom? ¿Cuáles fueron 2 o 3 decisiones clave?
7. ¿Qué son "Validation Onion" y "Contribution Process", y qué cambiaron?
8. ¿Qué usos concretos de IA quieres mostrar?
9. ¿En qué años estudiaste en la UNAM y en Sperientia?

## Orden propuesto
1. **Identidad y ubicación** (para el reclutador; poco esfuerzo, mucho impacto): rol canónico, "Culiacán, Mexico" visible, sin dobles espacios, meta descriptions nuevas.
2. **Métricas confiables:**
   - reconciliar el +12% con el +2pp;
   - corregir unidades;
   - quitar los absolutos hasta tener la base.
3. **Hero de Home e intro de About en la voz de la marca:** primera persona, la bandera y la forma de trabajar.
4. **Completar Helix:** rol y equipo, proceso y decisiones, aprendizajes.
5. **Completar Movistar:** resultados (o un "todavía no" explícito), Onikom y el equipo, decisiones.
6. **Pulido:**
   - typos;
   - mayúsculas;
   - "View project";
   - "@" en los títulos;
   - textos de accesibilidad de `src/ui` en inglés.

## Respuestas de la entrevista (2026-10-04)

1. **Título canónico:** Senior Product Designer. **Cargo en Coppel:** Design Lead (Purchase & Payments). Excepción consciente a §1, que dice "Coordinador de diseño".
2. **Años:** 8. Onikom de ago 2018 a ago 2019, Coppel desde ago 2019 (UX Researcher 2019 – 2022, Design Lead 2022 – hoy).
3. **Idioma:** inglés (excepción a §16.1).
4. **Helix:**
   - nombre: Helix;
   - fechas: diseño en Q4 2024, migración a Salesforce Commerce Cloud de Q2 a Q3 2025, lanzamiento en sep 2025, medición en ene 2026;
   - valores absolutos confidenciales: solo se publican incrementos;
   - fuentes: NPS con Medallia y medición manual; accesibilidad con Lighthouse y axe DevTools;
   - pasos: de 7 a 6 (se quitó Order Review);
   - equipo: 3 UI, 2 UXD y 1 UXW. Alan orquestó la experiencia, cuidó las reglas de compra durante la migración, metió accesibilidad y layout en Carrito, Datos de entrega, formularios de dirección, método de pago y Thank You Page, y trabajó la cultura del equipo con POs y devs;
   - decisión más difícil: cambiar la experiencia durante la migración, con precisión milimétrica, negociando y decidiendo con información incompleta;
   - aprendizajes: no hacer big bangs durante cambios estructurales; empoderar al equipo para decidir sin pasar por Alan como filtro.
5. **Coppel:** todos los incrementos (+2 pp de conversión web, +25% de ticket, −60% de rechazos, +80% de adopción) se midieron en ene 2026 con analítica digital, BI y Operaciones. El −60% viene de quitar Order Review, que permitió un iFrame para pagos seguros con tarjeta. El "+12% est." se retira.
6. **Movistar:** sin estudio formal; el feedback venía de reportes de marketing y CX tras cada release, con pruebas en producción e iteración. Alan era UX Lead en Onikom: formó un equipo de UX multicliente, participó en la captación de clientes y llevaba al equipo las necesidades de los usuarios. Año: 2018 – 2019.
7. **Validation Onion y Contribution Process:** pilotos en Coppel para un equipo sin gobierno de diseño. El Onion valida problemas por capas; el CP homologó cómo contribuir con investigación. Los absorbió el Centro de Excelencia en Diseño de Experiencia y Alan dejó las DesignOps.
8. **IA:** diseño potenciado por IA, con la IA como socio cocreador; prototipado rápido y cocreación con Claude Code.
9. **Estudios:** UNAM 2014 – 2017; diplomado en Sperientia en 2021 (mayo a junio).

**Pendiente:** confirmar la fuente del +7 pts de SUM (se publicó como "Usability testing") y pasar a inglés los textos de accesibilidad de `src/ui`.
