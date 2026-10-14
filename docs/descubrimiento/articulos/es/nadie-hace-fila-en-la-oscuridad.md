# **Nadie hace fila en la oscuridad**

*"Divulgación sobre el LCP, o por qué el primer elemento que aparece también es una decisión de diseño."*

03 Sep, 2026  
Alan Cisneros Gonzalez y Mariana Valenzuela Anaya  
*Editado por Ameyali*

Son las nueve de la noche y tienes un antojo de algo dulce. Te formas en el drive-thru de siempre, avanzas hasta la ventanilla, te detienes frente al menú. Pasan tres segundos, cinco... diez... Sabes que está encendida, observas el logo de tu cafetería favorita, estático. No hay precios, no hay productos, no hay movimiento.

Lo primero que piensas no es "qué lento está esto". Es "¿estará abierto?". Miras el retrovisor, calculas si te puedes salir de la fila sin pegarle al de atrás, y te vas a la repostería de enfrente, la que tiene las luces prendidas y el pastel decorado girando en el escaparate.

Nadie se forma en la oscuridad. No por impaciencia, sino porque una pantalla sin movimiento no comunica "espera": comunica "cerrado".

Ese mismo malentendido ocurre miles de veces al día dentro de los productos que diseñamos.

Imagina una tienda en línea cualquiera; llamémosla *la tienda*. Un cliente abre la app o escribe la dirección en su navegador porque quiere una tele o unos tenis. Durante los primeros segundos, la pantalla no solo está vacía. Está diciendo algo. Le está diciendo a la persona: "no sé si esto funciona".

El cliente no distingue entre su señal, su celular y nuestro servidor. Solo sabe que no pasa nada. Y el volantazo digital cuesta muchísimo menos que el físico: no hay coche atrás, no hay que dar la vuelta a la manzana. Es un gesto con el pulgar.

## El nombre técnico de la marquesina apagada

A ese momento exacto, el instante en que por fin aparece algo que vale la pena mirar, la industria le puso nombre: **Largest Contentful Paint** (LCP).

Mide el tiempo entre el clic y el momento en que se dibuja el bloque visual más grande de la pantalla: el banner de la campaña de temporada en la home, la foto principal de la ficha de producto, la primera fila de resultados de un listado.

Es una métrica rara entre las métricas técnicas, porque no le importa cuánto código se descargó ni cuántas peticiones se resolvieron. Le importa cuándo el cliente recibe la señal de "esto está abierto y es para mí". Google pone el límite de una buena experiencia en **2.5 segundos**.[^1]

Cuenta conmigo:

**Uno. Do… ymedio…**

Es poco cuando se cuenta, pero mucho cuando se espera.

Supongamos que, en un día normal, la página inicial de la tienda ronda entre 2 y 3 segundos. *Vive en la orilla del semáforo*. Y cuando llega la presión, esa orilla se rompe: en una semana de rebajas, aunque el cobro siga estable, el listado de productos puede tener picos de 20, 30 y hasta 40 segundos en los días de más tráfico.

Cuarenta segundos. Casi un minuto frente a una pantalla gris para ver una lista de tenis.

Ese cliente no se fue por el precio, ni por el catálogo, ni por cómo está resuelta la tarjeta de producto. Se fue antes de que existiera un diseño que juzgar.

## Cuánto vale eso

Conviene traducirlo, porque los diseñadores solemos hablar de fricción y de frustración, y esas dos palabras pesan poco en una junta de resultados.

Pongamos cifras redondas, solo para ilustrar: en una semana típica, la tienda recibe 2,000,000 de sesiones y tiene un ticket promedio de \$1,500 pesos. Supongamos que abrir la puerta más rápido nos gana apenas 5 puntos base de conversión: **0.05%**.

Pero, ¿qué significa ese 0.05%?

- 2,000,000 × 0.0005 = **1,000 órdenes adicionales**  
- 1,000 × \$1,500 = **\$1,500,000 pesos en una sola semana**  
- Sostenido durante las 52 semanas del año, **\$78 millones de pesos**

*Cinco puntos base.[^2]* Una cifra tan pequeña que en un reporte se ve como ruido, y aun así vale un millón y medio de pesos a la semana.

Esto no es una promesa de ingreso; es una regla de tres. Sirve para dimensionar el tamaño del premio, no para cobrarlo por adelantado. Pero cambia la conversación: deja de ser "el sitio se siente lento" y pasa a ser "esto es lo que hay del otro lado si lo arreglamos".

## La parte incómoda

El elemento más grande de la pantalla, ese que define el LCP, casi siempre es un elemento que diseñamos nosotros.

La imagen principal (hero). El carrusel de ocho banners que sirvió para que ninguna categoría se quedara sin espacio. La imagen preciosa que se ve increíble en Figma y pesa cuatro megas. La tipografía personalizada que bloquea el render del titular. El video que tenía que ir hasta arriba.

El LCP no es una métrica de ingeniería que a nosotros nos toca esperar. Es la consecuencia acumulada de decisiones de diseño: cuántos banners, qué tan pesada la imagen, qué aparece primero, qué puede esperar, qué es lo mínimo que necesita estar en pantalla para que alguien entienda que la tienda está abierta.

Nos tocó vivirlo. En alguna ocasión, un área comercial nos pidió un rediseño radical de una home: quería que se pareciera a un escaparate publicitario, lleno de imágenes, alertas e información. El LCP nos ayudó a explicar que en digital, si llenamos una página con miles de elementos visuales, todos compiten por ser renderizados, y que Google nos da herramientas para auditarnos y decidir en función no solo del negocio, sino también del rendimiento del producto. Auditamos con Lighthouse y Google Analytics. La home sí se rediseñó: conservó los elementos más impactantes y atrayentes, y el LCP quedó en un rango adecuado.

Diseñar para esos segundos de espera significa hacernos responsables de lo que ven las personas mientras hacen fila en nuestro drive-thru, para hacerles saber que sí estamos abiertos. Es, por ejemplo, incluir estados de carga para que el cliente sepa que el contenido ya viene en camino, que lo estamos atendiendo. Es diseñar la transición con el mismo cuidado que el contenido final.

Esa pantalla con bloques grises también es una decisión. Solo que normalmente no la tomamos a propósito.

---

*Todas las cifras de este artículo son hipotéticas e ilustrativas; no corresponden a ninguna empresa.*

[^1]: Google, "Largest Contentful Paint (LCP)", web.dev: un LCP de 2.5 segundos o menos, medido en el percentil 75 de las visitas, se considera bueno. https://web.dev/articles/lcp

[^2]: Punto base (1 bps): un 1% (un punto porcentual) equivale a 100 puntos base. Por lo tanto, 1 punto base es igual a 0.01%, la centésima parte de un punto porcentual. Es la unidad con la que el análisis digital habla de cambios pequeños cuando se trabaja con millones de visitas.
