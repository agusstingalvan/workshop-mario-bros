# Plan: Estados de Mario y daño

## Source spec
- Path: `.sdd/specs/005-estados-de-mario-y-dano.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/entities/Mario.js` ya tiene movimiento, salto, animación y body `16 × 22`.
- `src/game/constants/assets.js` define `SMALL_MARIO` (hitbox `16 × 22`, scale 1) y `SUPER_MARIO` (hitbox `20 × 26`, scale 1.5).
- `src/game/state/GameState.js` es de solo lectura y guarda vidas, monedas, puntaje y mundo.
- `src/game/scenes/Game.js` tiene un escenario de prueba con plataforma, pared, bloque, tubería y suelo continuo.
- No existen estados, daño, invulnerabilidad, pérdida de vida ni respawn.
- Decisiones: hitbox efectiva `20 × 26`, sin animación de muerte y crecimiento sin chequeo de techo.

## Proposed steps
1. Agregar `src/game/constants/damage.js` con invulnerabilidad `1500 ms`, parpadeo `100 ms` y alpha de parpadeo.
   Criteria covered: tuning centralizado.
2. Extender `GameState` con `loseLife()` y el evento `GAME_OVER_EVENT`, sin tocar puntaje ni monedas.
   Criteria covered: pérdida de vida y conservación de contadores.
3. Implementar la máquina de estados en Mario: `small`/`super`, `grow()`, `takeDamage()`, `die()`, ajuste de escala/hitbox manteniendo los pies y parpadeo alpha.
   Criteria covered: transformación, daño, invulnerabilidad y API pública.
4. Conectar Mario con la escena: escuchar el evento de daño, descontar vida, reiniciar el nivel o disparar Game Over con 0 vidas.
   Criteria covered: respawn, vidas y flujo de Game Over.
5. Adaptar el escenario de prueba: hongo, peligro y pozo; quitar la pared/bloque/tubería que bloqueaban el recorrido.
   Criteria covered: casos de transformación, daño, pozo y game over observables.
6. Verificar con build y una corrida CDP con logs de vida perdida y game over.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/damage.js` (nuevo): `MARIO_DAMAGE`
- `src/game/state/GameState.js`: `loseLife`, `GAME_OVER_EVENT`
- `src/game/entities/Mario.js`: `form`, `grow`, `takeDamage`, `die`, `#applyState`, `#updateInvulnerability`
- `src/game/scenes/Game.js`: `#handleMarioDamaged`, `#handlingDeath`, hongo/peligro/pozo
- `.sdd/evidence/005-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - captura Small inicial;
  - caminar al hongo → captura Super;
  - caminar al peligro → captura Small con LIVES 03 y parpadeo;
  - esperar la ventana → vida perdida y respawn con LIVES 02;
  - caer al pozo → LIVES 01 y respawn;
  - caer otra vez → LIVES 00 y log de Game Over.
- Logs `[mario] state ...`, `[game] vida perdida ...` y `[game] game over`.
- Consola sin errores.

## Stopping conditions

- El body escalado no conserva la hitbox efectiva `20 × 26`.
- El hongo o el peligro no son alcanzables desde el punto de inicio.
- El pozo no dispara la pérdida de vida.
- Aparece necesidad de implementar el hongo real, enemigos o pantalla de Game Over (fuera de alcance).
