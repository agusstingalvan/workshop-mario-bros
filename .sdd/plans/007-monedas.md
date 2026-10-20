# Plan: Monedas

## Source spec
- Path: `.sdd/specs/007-monedas.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/constants/assets.js` define `TILES.COIN` (tile `151`).
- `GameState` guarda monedas y puntaje de solo lectura; `Mario` no participa.
- `Game` tiene HUD mínimo y actualiza vidas.
- No existen monedas ni métodos para sumar monedas/puntos.
- Decisión: monedas flotantes en fila de tres para la prueba; HUD mínimo actualizado.

## Proposed steps
1. Crear `src/game/constants/coins.js` con hitbox `14 × 14`, giro `600 ms` y valor `1 moneda / 100 puntos`.
   Criteria covered: tuning centralizado.
2. Agregar `GameState.addCoin()` que incrementa monedas y puntaje.
   Criteria covered: contadores exactos.
3. Crear `src/game/entities/Coin.js`: body estático `14 × 14`, giro por `scaleX` y recolección única con evento.
   Criteria covered: giro, hitbox y no doble conteo.
4. Colocar tres monedas en el escenario de prueba y conectarlas por overlap con Mario.
   Criteria covered: recolección y distribución.
5. Actualizar el HUD mínimo al recoger y registrar el evento.
   Criteria covered: evidencia de contadores.
6. Verificar con build y corrida CDP: HUD antes/después, tres recolecciones, giro y una sola suma por moneda.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/coins.js` (nuevo): `COIN`
- `src/game/state/GameState.js`: `addCoin`
- `src/game/entities/Coin.js` (nuevo): `Coin`, `collect`, `COIN_COLLECTED_EVENT`
- `src/game/scenes/Game.js`: `#createCoins`, `#collectCoin`
- `.sdd/evidence/007-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - captura del HUD antes;
  - captura de dos frames del giro;
  - caminar y recoger las tres monedas, esperando el log de cada una;
  - HUD final `COINS 03` y `MARIO 000300`;
  - exactamente tres logs de recolección.
- Consola sin errores.

## Stopping conditions

- El overlap se dispara dos veces por moneda.
- El HUD no refleja los contadores.
- El giro deforma el body o rompe la recolección.
- Aparece necesidad de HUD definitivo o layout real (fuera de alcance).
