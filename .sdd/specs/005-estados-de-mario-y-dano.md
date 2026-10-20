# SPEC: Estados de Mario y daño

## Problem and player or user value

Los dos estados de Mario son el eje de progresión de la versión simplificada: el hongo cambia lo que Mario puede romper y cómo sobrevive al daño. Sin esta spec, bloques y enemigos no tienen consecuencias distintas.

## Current and expected behavior

**Actual**
- No existen estados, daño ni vidas.

**Esperado**
- Mario comienza como Small Mario con hitbox `16 × 22`.
- Al recoger un Super Mushroom pasa a Super Mario: mismos frames con `scale 1.5` e hitbox `20 × 26`.
- Con daño de enemigo:
  - Super Mario vuelve a Small Mario **sin** perder vida.
  - Small Mario pierde una vida y reaparece al comienzo del nivel como Small Mario.
- Después de recibir daño, Mario queda invulnerable unos segundos y parpadea por alpha.
- Caer en un pozo también cuesta una vida (el disparador lo define `011`).
- Al quedarse sin vidas se dispara Game Over (`015`).

## Related GDD or design reference

- §2.4. Small Mario, Super Mario, Mario con daño
- §3.3. Estados de Mario
- §5.2. Super Mushroom (efecto al recogerlo)
- §6.1 y §6.2. Daño de Goomba y Piranha Plant
- §8.2. Vidas

## Scope

- Máquina de estados `small` / `super` con transiciones explícitas.
- Cambio de hitbox, escala y posición al transformarse.
- Recibir daño desde una fuente externa (enemigo o pozo) mediante una API pública.
- Invulnerabilidad temporal con parpadeo alpha.
- Pérdida de vida, respawn al inicio del nivel y evento de vidas.
- Reinicio del estado a Small Mario tras perder una vida.

## Non-scope

- Lógica de detección de daño de cada enemigo (`009`, `010`).
- Recogida del hongo (`008`).
- HUD y contadores (`013`).
- Pantalla de Game Over (`015`).
- Animación de muerte: el pack no la trae.

## Constraints and assumptions

- **Tuning asumido**: invulnerabilidad de `1500 ms`; parpadeo por alpha con periodo de `100 ms`.
- **Regla confirmada**: perder una vida **no** reinicia puntaje ni monedas. Solo reinicia la posición y el estado de Mario. Los contadores vuelven a cero únicamente al comenzar una partida nueva (§11.4).
- La transformación debe mantener los pies de Mario en la misma posición para no atravesar el suelo.
- El daño de pozo no otorga invulnerabilidad; es muerte directa con pérdida de vida.
- La entidad no se muta desde fuera: el daño entra por un método público.
- La hitbox de Super es efectiva `20 × 26`; el body se ajusta por la escala `1.5` del sprite (`36 × 36` visuales).
- No hay animación ni pausa de muerte: el respawn es inmediato tras perder la vida.
- Si Mario crece sin espacio vertical, se mantiene el crecimiento; el caso con bloques se resuelve en `006`/`012`.
- Para verificar esta spec, el escenario esqueleto incluye un hongo y un peligro de prueba; `008`, `009` y `010` los reemplazan.

## Acceptance criteria

- [ ] Mario inicia la partida en estado Small con hitbox `16 × 22`.
- [ ] Recoger un hongo cambia a Super con `scale 1.5` y hitbox `20 × 26`, sin hundirse en el suelo.
- [ ] Un golpe de enemigo a Super Mario lo devuelve a Small sin descontar vidas.
- [ ] Un golpe de enemigo a Small Mario descuenta una vida y reinicia el nivel con Mario en el punto de inicio.
- [ ] Al perder una vida se conservan el puntaje y las monedas acumulados.
- [ ] Durante la invulnerabilidad, un segundo golpe no descuenta vida ni cambia de estado, y el parpadeo es visible.
- [ ] Caer en un pozo descuenta una vida y reinicia el nivel.
- [ ] Al llegar a 0 vidas se dispara el flujo de Game Over.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Video o captura de la transformación con hongo.
- Video o captura del ciclo Super → daño → Small → daño → vida perdida.
- Registro de la duración de invulnerabilidad usada.
- Playtest manual de respawn y de alineación de la hitbox al crecer.

## Open questions

- ¿Qué ocurre si Mario crece debajo de un bloque sin espacio vertical?
- ¿La hitbox de Super debe medir `20 × 26` aunque el sprite escalado ocupe `36 × 36`?
- ¿Hay animación o pausa de muerte antes del respawn? El GDD no la define.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
