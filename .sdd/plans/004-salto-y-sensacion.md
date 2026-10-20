# Plan: Salto y sensación de control

## Source spec
- Path: `.sdd/specs/004-salto-y-sensacion.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/entities/Mario.js` ya centraliza movimiento, gravedad asimétrica y animación.
- `src/game/constants/movement.js` contiene el tuning de 003.
- `src/game/scenes/Game.js` lee flechas + A/D y delega en `Mario.update`.
- La gravedad de subida (`1200`) ya está implementada y solo se usa al ascender.
- La plataforma de prueba está a 80 px del suelo; para separar coyote de buffer se sube a 160 px.
- No existe input de salto, buffer, coyote ni frame de aire.

## Proposed steps
1. Agregar `JUMP_VELOCITY`, `JUMP_BUFFER_MS` y `COYOTE_TIME_MS` a `src/game/constants/movement.js`.
   Criteria covered: constantes centralizadas.
2. Implementar en Mario los temporizadores de buffer y coyote, el impulso de salto y el reset de ventanas.
   Criteria covered: salto normal, buffer, coyote, sin repetición y sin doble salto.
3. Usar frame `[1]` mientras Mario está en el aire y mantener `mario_walk`/frame `[0]` en suelo.
   Criteria covered: frame de salto y caída.
4. Leer `Espacio`, `↑` y `W` con `JustDown` en `Game.update` y pasar `jumpPressed`.
   Criteria covered: una activación por pulsación.
5. Elevar la plataforma de prueba a `y = 540` para separar temporalmente coyote y buffer en la verificación.
   Criteria covered: evidencia de ambas ventanas.
6. Verificar con build y sesiones automatizadas: salto normal, pulsación mantenida, buffer, coyote dentro y fuera de ventana.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/movement.js`: `JUMP_VELOCITY`, `JUMP_BUFFER_MS`, `COYOTE_TIME_MS`
- `src/game/entities/Mario.js`: `#bufferMs`, `#coyoteMs`, `#updateJump`, `#jump`, `#updateAnimation`
- `src/game/scenes/Game.js`: `jumpPressed`, teclas `W`/Espacio/↑, plataforma a 540
- `.sdd/evidence/004-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP, tres sesiones:
  1. salto normal y pulsación mantenida;
  2. buffer al aterrizar;
  3. coyote dentro de la ventana y salto fuera de ventana.
- Capturas con Mario en aire y en suelo; comparación visual de altura.
- Consola sin errores.

## Stopping conditions

- El input de salto no llega por CDP.
- No se puede distinguir buffer de salto normal con las capturas.
- El coyote se confunde con el buffer por la altura de la plataforma.
- Aparece necesidad de salto variable, enemigos o nivel real (fuera de alcance).
