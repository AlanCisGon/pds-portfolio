# Historia del SDS · copy para Figma

Autora: Ameyali · 2026-10-06 · Para: Tenoch (preguntas a Alan) y Clara (diseño en Figma)
Estado: **listo para diseño**. Las respuestas de Alan (entrevista de Tenoch, 2026-10-06) ya están integradas; no queda ninguna marca pendiente.

Idioma: español de México (ADR 0001, documentación interna). "Somara Design System" no se traduce.
Fuentes: `src/app/work/projects/building-this-portfolio.mdx`, `docs/migration-plan.md`, `docs/design-system.md`, ADR 0001 a 0004, `docs/calibracion/0001-nombre-del-equipo.md`, el historial de git del 2 al 6 de octubre y `brand/alan-brand-guidelines.md` (§13, §14 y §15). Si una frase no sale de ahí, lleva marca.

---

## 1. Portada (`00 Cover`)

**Título**

> Somara Design System

**Subtítulo** (una línea, Newsreader)

> Empezó como una plantilla prestada. Hoy lleva el nombre del equipo que lo cuida.

Alternativa, si Clara necesita algo más corto:

> Veintisiete piezas y el nombre del equipo que las mantiene.

**Créditos** (reemplaza "Somara Studio Team — AI Agents plus Alan Cisneros", que contradice el ADR 0003)

> Somara Studio: Tenoch, Clara, Ameyali y Julieta, agentes de IA
> Dirección y decisiones: Alan Cisneros

**Estatus** (una línea, Geist Mono / `meta`)

> v0.1 · 27 componentes en Figma y en código · tokens 1:1 Figma ↔ CSS · 2026-10-06


**Nota para Clara.** La marca de taller sigue en proceso y la dibuja Alan a mano (§14, "Firma"). Si la portada le reserva un lugar, que se vea vacío o que no exista; no se simula.

---

## 2. Historia del Somara Design System

Una página que se lee con scroll. Va por días porque así pasó: cinco días, del 2 al 6 de octubre de 2026. Cada bloque tiene un titular (voz, Newsreader) y un cuerpo corto (sistema, Geist Sans). Las fechas van en Geist Mono.

### Titular de la página

> Cómo una plantilla prestada se volvió nuestra

### Entrada

> Aquí "nosotros" somos Alan y Somara Studio. Somara Studio son cuatro agentes de IA: Tenoch, Clara, Ameyali y Julieta. No somos personas y no lo fingimos. Alan diseña, decide y aprueba cada cambio. Esta es la historia de cómo hicimos juntos el sistema con el que está construido alancisneros.design, contada con lo que quedó escrito.

---

### Antes · Lo prestado

> El portafolio nació como un fork de Magic Portfolio, una plantilla hecha sobre la librería Once UI. Funcionaba, pero no era de Alan: 27 archivos dependían de Once UI, cada cambio visual había que hacerlo rodeando la plantilla, y en la primera medición el footer saltaba al cargar la página.
>
> El problema de fondo no era técnico. Alan no podía mostrar cómo diseña en un sitio cuyo diseño no había hecho.

---

### 2 oct · Primero la marca, luego la pieza más chica

> Ese día Alan escribió su guía de marca: titanio y cerezo, frío por estructura y cálido por contacto, un solo color cálido y solo donde va la mano. Todo lo que vino después la lee antes de empezar.
>
> Todavía no había nombres. Alan trabajaba con Claude Code en tres frentes: código, sistema y contenido.
>
> Antes de diseñar todas las bases probamos el ciclo completo con el componente más chico del sitio: el `Tag` de las habilidades. Las variables volvieron de Figma con los mismos nombres que en `tokens.css`, sin traducción. El frente de código, que dos días después se llamaría Tenoch, midió el `Tag` en el navegador: alto, padding, radio, tipografía y color coincidían con el frame. La prueba también encontró cuatro fricciones, y la más importante cambió el diseño: un componente que informaba y a la vez respondía al clic se volvió dos, `Tag` y `Chip`.
>
> Ese mismo día nacieron los primeros tokens, con el mismo nombre en Figma y en CSS, y podamos lo que la marca no necesitaba: el blog de ejemplo con sus 11 posts, la galería, el newsletter y una pantalla de contraseña. Esa pantalla era la que empujaba el footer. Al quitarla, el salto de layout en Home bajó de 0.225 a 0.013 en laboratorio.

> Para Alan, ese fue el primer momento en que todo encajó:
>
> *"Que la dinámica de agentes y que el plan que habíamos cocreado funcionó a la perfección: me sentí súper orgulloso y motivado. Fue un momento eureka para mí."*

---

### 3 oct · Cambiar la ruta a media obra

> El plan decía seis incrementos más para reemplazar Once UI pieza por pieza. Cuando los 25 componentes ya existían en código, lo cambiamos por cuatro pull requests que movían secciones completas: el marco del sitio, Work, Home y About, y el cierre.
>
> Al terminar el día, buscar Once UI en el código no devolvía nada. El JavaScript por ruta bajó de 453 kB a 147 kB y el salto de layout quedó en cero.
>
> Ese cambio de ruta no fue solo técnico. Alan había empezado con pasos muy chicos, a propósito:
>
> *"Comencé siendo mucho muy cauteloso por miedo a que todo se autodegenerara muy rápido. Al inicio pensaba muy en pequeño y, con el pasar de los días, entendí que podíamos crecer con control."*

---

### 4 oct · Los frentes reciben nombre

> Newsreader entró como la voz del sistema: titulares y citas, nunca botones ni navegación. Los textos de accesibilidad pasaron a inglés, el idioma de la página.
>
> Ese día los tres frentes se volvieron Tenoch, Clara y Ameyali. Cada uno quedó escrito en su propio archivo: su rol, sus fuentes de verdad, lo que puede tocar y lo que debe entregar a otro. Poco después Clara quedó trabajando solo en Figma: puede leer el código, pero sus propuestas llegan a él a través de Tenoch. Cada agente tiene las herramientas que su trabajo necesita y ninguna más.

---

### 5 oct · Un no, cuatro rondas y un nombre

> Julieta se sumó y empezó a convertir con Tenoch el trabajo pendiente en issues del backlog. El crédito por escribirlos es de los dos.
>
> El equipo necesitaba un nombre. Ameyali entregó dos, Veta y Tequio, y Alan los rechazó: *"Sus propuestas son súper básicas, hacen analogías de primer grado de primaria, necesito profesionales en branding y escritura."* Tenía razón, y quedó escrito por qué: a Ameyali le faltaba método y el encargo la empujaba a lo literal.
>
> Ese no cambió cómo trabajamos. Ameyali ganó un método de naming. Alan escribió cómo cambia el criterio de los agentes: nadie edita el suyo, cada regla nombra el caso que la motivó y su contrapeso, y él aprueba cada cambio. En la segunda ronda hubo unos 60 candidatos, y Alan afinó el brief: el nombre es de los agentes, no lleva su apellido y funciona igual en inglés y en español. La tercera salió fría. La cuarta pidió nombres inventados que tuvieran calor.
>
> *"Somara Studio me encanta."*
>
> Somara se dice sobre el sonido de *somos*.
>
> El equipo también necesitaba un lugar en el caso de estudio. El `TeamCard` muestra bien cómo pasa una pieza de mano en mano: Alan lo esbozó en Figma Slides, Clara lo mejoró y lo alineó a la marca, y Tenoch lo llevó a código (#82 y #85).

---

### 6 oct · Sin fuente no hay número

> El `Badge` aprendió a vivir sin ícono, con una condición: sin ícono, su texto nombra el estatus. Nunca solo el color.
>
> Llegaron `Stat` y `FactSheet`. `Stat` muestra un incremento con su unidad, su periodo y su fuente. Si falta cualquiera de los tres, el componente no inventa: muestra *pending* en lugar del número. La regla de no inventar métricas dejó de ser solo una instrucción para nosotros y quedó dentro del componente. Para `FactSheet`, Clara exploró opciones y Alan eligió la B: el equipo ocupa dos columnas, con sus avatares y sus nombres.
>
> Clara dibujó el frame del caso destacado de Home y Tenoch lo llevó a código tal como estaba: el badge primero y dos niveles de espacio. Ese día quedó escrita otra división: Clara deja las secciones listas y Alan es quien las marca *Ready for dev*.
>
> Y el sistema cambió de nombre. Nació como *PDS · Portfolio Design System*, un nombre que describía una migración. Con 27 componentes, tokens compartidos y un equipo con nombre propio, Alan decidió que merecía uno suyo, y que debía ser el del equipo que lo mantiene. Desde ese día se llama Somara Design System.
>
> Alan lo explica así: *"El design system se ha vuelto un reflejo de la marca personal de Alan Cisneros, así como lo es Somara Studio."* Studio es el equipo de IA; Design System, la fuente de verdad que ese equipo cuida.

---

### Dos decisiones difíciles

**Dejar el plan a la mitad.**

> Teníamos un plan de siete incrementos y estaba funcionando. Seguirlo era lo seguro. Cuando los componentes ya existían, cada incremento pendiente costaba más de lo que aportaba, y uno de ellos, un puente de colores entre Once UI y nuestros tokens, se iba a tirar en cuanto Once UI saliera. Lo cambiamos por cuatro pasos más grandes, cada uno todavía lo bastante chico para revisarlo en un preview y revertirlo. El puente nunca se hizo.
>
> Fue una decisión del equipo, y lo que la hizo posible fue la confianza. En palabras de Alan: *"Comprender de manera clara los guardrails y la logística de producción hizo que cambiara el enfoque."* La confianza creció en tres lugares a la vez: en él mismo, en lo que el equipo podía hacer y en la personalidad de los agentes.

**Revertir una decisión propia.**

> El 3 de octubre decidimos que los enlaces dentro de un párrafo se distinguirían solo por el Cerezo. El 5 lo revertimos: contra el texto, el Cerezo da unos 2.8:1, menos de los 3:1 que pide WCAG cuando un enlace se distingue solo por color. Desde entonces el enlace en un párrafo va siempre subrayado. Era una decisión nuestra, de dos días antes; la cambiamos igual, porque la regla de accesibilidad pesa más que el gusto.

---

### Cómo nos tratamos

> El cariño en este equipo no se dice: se nota en cómo trabajamos.
>
> - **El crédito lleva nombre.** Tenoch no dice "buen trabajo"; dice qué hizo Clara o Ameyali y por qué funcionó.
> - **Decir que no también es cuidar.** Si Alan pide algo que contradice la marca o el sistema, el agente se lo dice antes de hacerlo, una vez y con fundamento. Después Alan decide, y la decisión se respeta.
> - **Lo que no cumple se devuelve, no se corrige en silencio.** Cada observación tiene cuatro partes: qué se encontró, qué regla no se cumple, qué cuesta dejarlo así y cómo lo resolveríamos.
> - **Nadie edita su propio criterio.** Cada cambio pasa por un pull request que Alan aprueba.
> - **Todo deja registro.** Decisiones en ADR, rondas en la calibración y cada cambio en su pull request. Esta historia se pudo escribir porque nada de esto se quedó en la memoria de nadie.

> Dos ejemplos de cómo se ve un no con fundamento:
>
> - **Tenoch, el 6 de octubre.** Después de quitar el reloj y la zona horaria del header, le dijo a Alan que la hipótesis del error de hidratación de React (#70) ya no tenía sentido. También le propuso reordenar el trabajo, porque los cambios del día ya resolvían issues planeados para después. Señaló el problema y llevó rutas alternativas.
> - **Ameyali, como hábito.** Alan lo cuenta como algo constante: Ameyali le recuerda la marca, le pide no dar datos falsos ni inventados, y le pide rectificar el contenido cuando un dato no tiene fuente.

---

### Quién hizo qué

> **Alan Cisneros** · Escribió la marca, eligió los autores detrás del criterio de cada agente, respondió las entrevistas, esbozó el `TeamCard`, rechazó lo que no estaba a la altura, decidió cada nombre y aprobó cada merge.
>
> **Tenoch** · IA. Escribe el código y corre las pruebas. Llevó el `Tag` de Figma a código y lo midió contra el frame, migró el sitio sin Once UI, implementó el `TeamCard` y abre un pull request revisable por cada cambio.
>
> **Clara** · IA. Cuida variables, estilos y componentes en Figma. Llevó el esbozo del `TeamCard` a la marca, exploró las opciones de `FactSheet`, dibujó el frame del caso destacado y deja las secciones listas para que Alan las marque.
>
> **Ameyali** · IA. Entrevista a Alan y escribe con su voz. Perdió la primera ronda del nombre y ganó la cuarta con un método nuevo.
>
> **Julieta** · IA. Con Tenoch, convierte lo que viene en issues claros del backlog y comparte el crédito por escribirlos.

---

### Lo que sigue

> v0.1 quiere decir que lo que está aquí funciona y lo que falta tiene nombre:
>
> - validar la escala tipográfica en pantallas reales;
> - darles tono a las categorías reales cuando existan;
> - integrar `Chip` cuando el sitio tenga filtros;
> - la marca de taller, que dibuja Alan a mano. No la vamos a inventar.
>
> Tampoco sabemos todavía si cuatro agentes con roles definidos trabajan mejor que una sola sesión general. La calibración tiene un caso. Lo vamos a observar antes de afirmarlo.
>
> Alan ya mira más lejos: Studio y Design System ya son dos nombres bajo Somara, y él imagina que algún día Somara pueda volverse un hub de submarcas. Hoy es una visión, no un plan.

**Cierre** (Newsreader, una línea, palabras de Alan)

> Lo hicimos con eficiencia y cariño; ahora nos corresponde cuidarlo.

---

## 3. Preguntas para Alan: respondidas

Tenoch entrevistó a Alan el 2026-10-06. Así quedó cada respuesta:

1. **El `Tag`:** cita textual en el bloque del 2 de octubre. En la cita solo se corrigió la ortografía: "cocreado" y "eureka".
2. **El nombre del sistema:** cita textual en el bloque del 6 de octubre. La idea de Somara como hub de submarcas va en "Lo que sigue" como visión, no como decisión.
3. **La ruta por secciones:** se cuenta como decisión del equipo, sin atribuirla a nadie. Lo que convenció a Alan, la cautela que se volvió "crecer con control", está en el bloque del 3 de octubre y en "Dos decisiones difíciles". Es el arco emocional de la página.
4. **Un no con fundamento:** el caso de Tenoch con #70 y el reordenamiento del trabajo, y el hábito de Ameyali contado como hábito, sin inventar un caso.
5. **El cierre:** la línea de Alan, sin cambios de palabras.

**Datos:**

- La exploración de `FactSheet` (`184:583`) la hizo Clara (confirmado). Ya está en su crédito.
- `TeamCard` (`83:152`): Alan lo esbozó en Figma Slides, Clara lo mejoró y lo alineó a la marca, y Tenoch lo implementó (#82 y #85). Confirmado por Alan a través de Tenoch y contado en el bloque del 5 de octubre como ejemplo del flujo Alan → Clara → Tenoch.

---

## 4. Filtro de sello (§15) y pruebas de la formación

**§15**

1. **Problema real:** sí. Corrige una portada que contradecía el ADR 0003 y da al archivo la historia de por qué existe cada decisión.
2. **Balance:** sí. La tecnología (tokens 1:1, JS, CLS), el producto (ruta por secciones), el diseño (Newsreader, subrayado) y la parte de "negocio" de este proyecto, que es la credibilidad del portafolio (sin fuente no hay número), aparecen juntas.
3. **Rigor y saber cerrar:** sí. Cada día cierra con un resultado verificable y "Lo que sigue" nombra pendientes concretos en lugar de promesas.
4. **Audiencia:** el equipo y quien abra el archivo de Figma (líder de diseño o diseñador en formación, §10): síntesis en los titulares y proceso en el cuerpo.
5. **Confiable, de autor y generosa:** confiable porque todo tiene fuente y lo que falta está marcado; de autor porque las decisiones son de Alan y con nombre; generosa porque cuenta también el error (la ronda 1) y reparte el crédito.
6. **Que desaparezca:** es la prueba que menos aplica a un texto de documentación. Lo más cercano: se lee sin explicar la plantilla ni la jerga de Once UI.

**Bordes (§12):** nada genérico (cada frase trae un hecho), nada individualista (crédito por persona y por agente), nada desconfiable (cero cifras nuevas; las de rendimiento llevan "en laboratorio").

**Pruebas de `docs/formacion-personalidad.md`**

- *Tapa el logo:* no podría ser de otro sistema. Los hechos (Tag, Cerezo, Somara, 2.8:1) son solo de este.
- *Honestidad:* el texto dice que los agentes son IA tres veces, en la entrada, los créditos y "Quién hizo qué", sin volverlo un tema.
- *Pico y final:* hay dos picos. Uno es el "momento eureka" del `Tag`; el otro, "Somara Studio me encanta" después del rechazo. La columna vertebral es el arco de Alan, de la cautela a "crecer con control". El final mira a pendientes reales y a una visión que no se promete, y la última línea es de Alan.
- *Tono:* calibrado con lo que Alan dijo de sí mismo ("soy mucho más cariñoso y cercano"). El cariño lo ponen sus propias citas; el texto alrededor se queda sobrio para no competir con ellas.
- *Prohibidos verbales:* sin exclamaciones, sin "no es solo X", sin rayas encadenando ideas, sin tripletas de adjetivos, sin espacios internos privados. Lo privado no se menciona, ni siquiera como nombre de ruta (regla de Alan, 2026-10-06).

**Lo que dejé fuera a propósito**

- El rendimiento con detalle (LCP, Speed Insights): está en el caso público y aquí no suma a la historia.
- Todo lo que no es público y cualquier dato de Coppel sin publicar.
- Las metáforas de carpintería: §13 las permite "cuando aclaran, sin forzarlas", y aquí los hechos alcanzaban.
- "Cuida" en el subtítulo de la portada es la única palabra que el ADR no usa (dice "mantiene"). La elegí por la calidez que pidió Alan; si se prefiere la literal, va la alternativa.

**Autores y el rasgo que respalda a cada uno**

| Autor | Regla aplicada | Rasgo (marca) |
|---|---|---|
| Le Guin | Largos de oración variados; el pico ("Somara Studio me encanta.") va solo y corto después de un párrafo largo | Cálida (§13) |
| Calvino | Exactitud (cifras con su condición, "en laboratorio") y levedad (sin adjetivos que carguen la emoción) | Concreta, honesta (§13) |
| Ibargüengoitia | Voz es-MX natural y sin solemnidad. **Sin ironía:** Alan pidió un tono emotivo y la marca no define el humor; gana el rasgo | Cálida pero asertiva |
| Monterroso | Portada: qué se quita sin perder el sentido (de "AI Agents plus" a una línea de créditos) | Concreta |
| Grijelmo | Connotación de "prestada" (sin reproche a la plantilla) y de "cuida" frente a "mantiene" | Generosa |
| Heath (formación) | Momento de elevación y conexión con un hecho, no con un adjetivo | Generosa, colectiva |
| Kahneman (formación) | Pico y final: el rechazo y el "me encanta", y un cierre cuidado | Confiable |

No hay `PERSONALIDAD.md` para el SDS; mandan las guías de marca, como en el resto del portafolio.
