# 0002. Gobernanza del criterio de los agentes

- **Estado:** aceptada
- **Fecha:** 2026-10-05
- **Decidió:** Alan

## Contexto

- Cada vez que una entrega falla, la reacción natural es sumar una regla al archivo del agente (#69 para Clara y #74 para Ameyali, el mismo día). Si nada lo frena, los archivos se llenan de parches que se contradicen.
- Hay cuatro formas en que el criterio se degenera:
  1. **Acumulación:** las reglas entran y ninguna sale.
  2. **Péndulo:** una regla contra un extremo empuja al extremo opuesto.
  3. **Goodhart:** el agente cumple la regla en lugar de lograr el resultado.
  4. **Eco:** los agentes se validan entre sí o toman sus entregas viejas como precedente.
- Alan rechazó dos nombres de equipo por literales ("Veta" y "Tequio"). La causa fue doble: a Ameyali le faltaba método (#74) y el encargo de Tenoch la empujó a lo literal.

## Decisión

1. **Nadie edita su propio criterio.** Los archivos de `.claude/agents/`, `docs/formacion-personalidad.md` y los ADR cambian solo por PR que aprueba Alan. Tenoch tampoco edita el suyo sin ese PR.
2. **Cada regla trae su incidente y su contrapeso.** El PR dice qué la motivó, con link, y escribe la regla con su "pero no", igual que los rasgos de personalidad.
3. **Dos incidentes antes de una regla.** Un error aislado se corrige en la entrega. Una regla nueva entra solo si el error se repite o si falta algo de fondo (un método o una fuente que no existía), y el PR dice cuál de los dos casos es.
4. **Presupuesto:** cada archivo de agente tiene un tope de 180 líneas. Si una regla nueva no cabe, otra se fusiona o sale, y el PR dice cuál.
5. **Juez externo.** Las entregas viejas de los agentes no son precedente; solo lo son los ADR. Para desempatar mandan las decisiones de Alan y la evidencia real (analítica, feedback de usuarios), nunca el acuerdo entre agentes.
6. **Calibración antes del merge.** `docs/calibracion/` guarda casos que Alan aprobó o rechazó, cada uno con su porqué. Todo cambio al criterio de un agente se prueba con al menos un caso relevante, y el PR muestra el antes y el después.
7. **Si se siguió la regla y el resultado falló, se revisa la regla.** No se le agrega otra encima.
8. **Auditoría de criterio** en las ventanas de revisión (días 5 y 10 del sprint). Tenoch revisa los archivos de los agentes y la formación, y reporta:
   - contradicciones;
   - reglas duplicadas;
   - reglas que nadie usó en el sprint;
   - reglas de un solo incidente con más de un sprint;
   - archivos cerca del tope.

## Consecuencias

- Los PRs que tocan el criterio llenan la sección *Criterio de los agentes* de la plantilla de PR.
- Cambiar el criterio cuesta más: hay que escribir el incidente, el contrapeso y la calibración. Es a propósito.
- Un error aislado ya no produce una regla. Se corrige en la entrega y, si se repite, se registra en `docs/calibracion/`.
- #74 se ajusta a este ADR antes de su merge: contrapeso, ejemplo genérico y calibración con el caso 0001.
