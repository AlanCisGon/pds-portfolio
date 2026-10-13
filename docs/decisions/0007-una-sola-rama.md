# 0007. Una sola rama de larga vida: `main`

- **Estado:** aceptada
- **Fecha:** 2026-10-13
- **Decidió:** Alan
- **Reemplaza:** el flujo `dev` → `main` del 2026-10-11 (somara-studio #3)

## Contexto

- El 2026-10-11 se adoptó `dev` como rama de desarrollo y `main` como producción, con publicación adelantando `main` hasta `dev`.
- En la práctica `dev` desapareció del remoto y el flujo sumaba un paso de publicación sin dar una revisión que el preview de Vercel no diera ya.
- Con 2 a 5 horas por semana de Alan, cada paso extra cuesta revisión.

## Decisión

- `main` es producción y la rama por defecto. No existe `dev`: no se recrea.
- Cada cambio va en su rama (`feat/`, `fix/`, `chore/`, `content/`, `docs/`) con PR normal contra `main`.
- **La revisión es el preview de Vercel del PR,** en 390 y 1280 px.
- Merge con squash y solo con aprobación de Alan (`gh pr merge <n> --squash --delete-branch`).
- Antes del merge, la rama se pone al día con `main` y se espera su Preview.

## Consecuencias

- Una puerta menos entre el código y producción: lo aprobado se publica al hacer merge.
- No hay entorno intermedio. Lo arriesgado se prueba en el preview de su propia rama.
- **Reversión:** Instant Rollback de Vercel para el despliegue anterior; para algo más viejo, `git revert` del commit de squash en un PR.
