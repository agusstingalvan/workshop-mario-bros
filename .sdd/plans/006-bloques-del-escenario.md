# Plan: Bloques del escenario

## Source spec
- Path: `.sdd/specs/006-bloques-del-escenario.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/constants/assets.js` ya tiene `TILES.HARD_BLOCK` (`11`), `QUESTION_BLOCK` (`10`), `EMPTY_BLOCK` (`9`), `BRICK_BLOCK` (`29`) y `SUPER_MUSHROOM`.
- `Mario` expone `isSuper`, `grow()` y colisiona con grupos estáticos.
- `Game` tiene un escenario de prueba con suelo, hongo y peligro; no hay bloques.
- No existe detección de golpe desde abajo ni respuesta de rebote.
- Decisión: el ? Block siempre entrega un hongo.

## Proposed steps
1. Crear `src/game/constants/blocks.js` con rebote `4 px` y `60 ms`.
   Criteria covered: tuning centralizado.
2. Crear la jerarquía `Block` → `HardBlock`, `BrickBlock`, `QuestionBlock`, `EmptyBlock`, más una factory por tipo.
   Criteria covered: variantes por polimorfismo y una sola condición por tipo.
3. Implementar el rebote con tween y actualización del body estático.
   Criteria covered: desplazamiento y retorno.
4. Implementar la ruptura de ladrillo con Super, el cambio `? → 9` y la entrega única de hongo.
   Criteria covered: romper, transformar y no repetir.
5. Reemplazar el escenario de prueba por uno con un bloque de cada tipo, un hongo de prueba y un bloque lateral.
   Criteria covered: casos observables con Small y Super.
6. Conectar el collider de Mario con el grupo de bloques y disparar `hit()` solo con `touching.up`.
   Criteria covered: golpe desde abajo y no desde lateral/superior.
7. Verificar con build y corrida CDP con logs por bloque.
   Criteria covered: todos los criterios observables.

## Files and symbols

- `src/game/constants/blocks.js` (nuevo): `BLOCK_TUNING`
- `src/game/entities/blocks/Block.js` (nuevo): `Block`, `bounce`
- `src/game/entities/blocks/HardBlock.js`, `BrickBlock.js`, `QuestionBlock.js`, `EmptyBlock.js` (nuevos)
- `src/game/entities/blocks/createBlock.js` (nuevo): `BLOCK_TYPES`, `createBlock`
- `src/game/scenes/Game.js`: grupo de bloques, collider por `touching.up`, escenario de prueba y hongo
- `.sdd/evidence/006-*`

## Verification

- `npm run build` sin errores.
- Chrome headless/CDP:
  - Small golpea hard y brick: rebote sin rotura;
  - Small golpea ?: aparece hongo y el tile pasa a `9`;
  - recoger hongo de prueba → Super;
  - Super golpea brick: desaparece;
  - segundo golpe al ? usado: sin hongo;
  - golpe a Empty Block: sin contenido;
  - contacto lateral con bloque: sin evento.
- Logs `[block] ...`.
- Consola sin errores.

## Stopping conditions

- El collider no distingue golpe desde abajo de contacto lateral/superior.
- El tween de rebote desincroniza el body estático.
- El hongo aparece dentro del bloque o inalcanzable para la evidencia.
- Aparece necesidad de movimiento del hongo o layout real (fuera de alcance).
