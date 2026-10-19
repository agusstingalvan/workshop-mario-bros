# Plan: Main Menu y World Screen

## Source spec
- Path: `.sdd/specs/002-pantallas-menu-y-world.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/main.js` registra solo `Game`.
- `src/game/scenes/Game.js` es la escena base de validación de la spec 001; carga las hojas y muestra un preview a ×4.
- `src/game/constants/assets.js` ya expone `TEXTURES` y `CHARACTERS.SMALL_MARIO`.
- No existen menú, pantalla de mundo, navegación ni estado de partida.
- `docs/GDD.md` §11.1–§11.3 y §12 definen el flujo; §9 define el formato del HUD.
- Decisiones aprobadas: `Boot → MainMenu → WorldScreen → Game`, título `SUPER MARIO BROS`, World Screen de solo texto con 2000 ms, HUD mínimo temporal de texto.

## Proposed steps
1. Crear `src/game/state/GameState.js` con vidas 3, monedas 0, puntaje 0 y mundo `1-1`.
   Criteria covered: estado inicial de partida.
2. Crear `src/game/scenes/Boot.js`: cargar las hojas de §2 y crear el `GameState`, luego iniciar `MainMenu`.
   Criteria covered: assets disponibles para todas las pantallas.
3. Crear `src/game/scenes/MainMenu.js`: título, subtítulo y botón «Jugar» con mouse, Enter y Espacio; guarda contra doble activación.
   Criteria covered: menú inicial y navegación a World Screen.
4. Crear `src/game/scenes/WorldScreen.js`: `WORLD 1-1` centrado, input deshabilitado y `delayedCall` de 2000 ms hacia `Game`.
   Criteria covered: texto centrado, espera automática, sin volver al menú.
5. Reescribir `src/game/scenes/Game.js` como nivel esqueleto: fondo, suelo provisional, Small Mario en el punto de inicio y HUD mínimo temporal.
   Criteria covered: Mario visible y estado 3/0/0 visible.
6. Registrar `Boot`, `MainMenu`, `WorldScreen` y `Game` en `src/game/main.js`.
   Criteria covered: arranque en Main Menu.
7. Verificar con build, servidor de desarrollo y capturas de las tres pantallas.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/state/GameState.js` (nuevo): `GAME_STATE_KEY`, `INITIAL_STATE`, `GameState`
- `src/game/scenes/Boot.js` (nuevo): `Boot`
- `src/game/scenes/MainMenu.js` (nuevo): `MainMenu`, `#startGame`
- `src/game/scenes/WorldScreen.js` (nuevo): `WorldScreen`
- `src/game/scenes/Game.js` (reescrito): `Game`, `#createHud`
- `src/game/main.js`: lista de escenas

## Verification

- `npm run build` sin errores.
- `npm run dev` + Chrome headless/CDP: captura del menú, clic en «Jugar», captura de World Screen y captura del nivel tras 2 s.
- Consola sin excepciones.
- Comprobar en la captura del nivel: Small Mario visible y HUD con `LIVES 03`, `COINS 00`, `MARIO 000000`, `WORLD 1-1`.

## Stopping conditions

- El clic o el teclado no llegan al botón por el escalado del canvas.
- La transición de 2000 ms no se puede verificar de forma estable.
- Aparece necesidad de implementar movimiento, nivel o HUD definitivo (fuera de alcance).
