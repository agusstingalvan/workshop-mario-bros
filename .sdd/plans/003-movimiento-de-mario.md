# Plan: Movimiento horizontal y colisiones de Mario

## Source spec
- Path: `.sdd/specs/003-movimiento-de-mario.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/scenes/Game.js` es un nivel esqueleto con Mario estático a escala ×2 y un HUD de texto.
- `src/game/main.js` no habilita físicas.
- `src/game/constants/assets.js` ya tiene `CHARACTERS.SMALL_MARIO` con frames, origen y hitbox, y las secuencias de tiles.
- `src/game/scenes/Boot.js` carga las hojas y crea el estado de partida.
- No existe entidad Mario, input de movimiento ni colisiones.
- Decisiones: tuning asumido, sin scroll vertical, mundo provisional 1024 × 768 y escenario de prueba para colisiones.

## Proposed steps
1. Agregar `src/game/constants/movement.js` con el tuning de §Constraints.
   Criteria covered: constantes centralizadas.
2. Agregar la animación `mario_walk` a `src/game/constants/assets.js` y crearla en `Boot` tras cargar las hojas.
   Criteria covered: animación de caminata.
3. Crear `src/game/entities/Mario.js`: `Physics.Arcade.Sprite`, origen y body `16 × 22`, aceleración/frenado, gravedad variable, volteo y animación.
   Criteria covered: movimiento, hitbox, origen, animación e inversión.
4. Habilitar Arcade Physics en `src/game/main.js`.
   Criteria covered: gravedad y colisiones.
5. Reescribir `Game.create` con límites de mundo, escenario de prueba (suelo, plataforma, bloque, tubería y pared), collider estático, Mario y teclas flechas/A-D.
   Criteria covered: caída, apoyo, colisiones y bordes del mundo.
6. Implementar `Game.update` que lea el input y delegue en `Mario.update`.
   Criteria covered: control jugable y separación lógica/presentación.
7. Verificar con build y una corrida automatizada con capturas y comparación de frames quietos.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/movement.js` (nuevo): `MARIO_MOVEMENT`
- `src/game/constants/assets.js`: `ANIMATIONS.MARIO_WALK`
- `src/game/entities/Mario.js` (nuevo): `Mario`, `update`, `#updateAnimation`
- `src/game/scenes/Boot.js`: creación de animaciones
- `src/game/scenes/Game.js`: `#createScaffold`, `#createHud`, `update`
- `src/game/main.js`: configuración `physics.arcade`

## Verification

- `npm run build` sin errores.
- `npm run dev` + Chrome headless/CDP:
  - captura inicial tras aterrizar en la plataforma;
  - dos capturas separadas 500 ms sin input para comprobar que no vibra;
  - ArrowRight hasta el borde derecho y dos capturas para comprobar que se detiene;
  - ArrowLeft hasta la pared y dos capturas para comprobar la colisión;
  - captura en movimiento para ver la animación y el volteo.
- Consola: log de hitbox `16 × 22` y origen `(0.5, 1)`, sin errores.

## Stopping conditions

- Arcade Physics no acepta el body `16 × 22` con la escala actual.
- El input por CDP no llega a Phaser.
- El escenario de prueba impide observar caída, colisión y borde del mundo.
- Aparece necesidad de salto, cámara o nivel real (fuera de alcance).
