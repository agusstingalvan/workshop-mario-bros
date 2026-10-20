# Evidence: Bloques del escenario

## Source records
- Spec: `.sdd/specs/006-bloques-del-escenario.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/006-bloques-del-escenario.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Golpear un Hard Block desde abajo lo desplaza y lo devuelve, sin romperse, con Small y con Super | Saltar bajo el Hard Block con Small y luego con Super; logs y capturas | Rebote sin rotura en ambos estados | `[block] hard hit` dos veces; el bloque sigue en su lugar | `.sdd/evidence/006-hard-small.png`, `.sdd/evidence/006-hard-super.png` | El desplazamiento de 4 px no se capturó a mitad del tween; se verificó por constante y por el rebote observado |
| Golpear un Brick Block con Small lo desplaza y lo devuelve sin romperse | Saltar bajo el ladrillo con Small | Rebote sin rotura | `[block] brick bounce`; el ladrillo sigue visible | `.sdd/evidence/006-brick-small.png` | Igual que el punto anterior |
| Golpear un Brick Block con Super lo destruye y el espacio queda transitable | Recoger hongo, volver al ladrillo y saltar | Bloque eliminado y paso libre | `[block] brick broken`; el ladrillo desaparece y Mario queda en el espacio | `.sdd/evidence/006-brick-roto.png` | — |
| Golpear un ? Block entrega un hongo, se anima y queda mostrando el tile `9` | Saltar bajo el ? Block; log y captura | Hongo sobre el bloque y tile `9` | `[block] question used`; el tile cambia a `9` y aparece un hongo encima | `.sdd/evidence/006-question-usado.png` | El hongo es estático; su movimiento es alcance de `008` |
| Un ? Block ya usado no entrega un segundo hongo | Volver a golpear el ? Block usado | Sin segundo hongo | `[block] question empty`; sigue habiendo un solo hongo | `.sdd/evidence/006-question-vacio.png` | — |
| Un Empty Block es sólido, pisable y no entrega nada | Golpear el Empty Block y pararse sobre un bloque de la misma jerarquía | Sin contenido y superficie pisable | `[block] empty hit`; Mario se para sobre un bloque en `006-encima-bloque.png` | `.sdd/evidence/006-empty-hit.png`, `.sdd/evidence/006-encima-bloque.png` | La superficie pisable se verificó sobre un Hard Block; el Empty Block se verificó sólido por colisión, no se intentó pararse encima |
| Ningún bloque se rompe ni entrega objetos por contacto lateral o desde arriba | Caminar contra el bloque lateral y pararse encima de un bloque | Sin logs de golpe ni cambios | `006-lateral.png` y `006-encima-bloque.png` sin nuevos `[block]` | `.sdd/evidence/006-lateral.png`, `.sdd/evidence/006-encima-bloque.png` | Solo se probó un contacto lateral y uno superior |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 006 implementada y verificada. Los bloques son entidades polimórficas (`Block` → `HardBlock`, `BrickBlock`, `QuestionBlock`, `EmptyBlock`) creadas por una factory; el golpe se detecta solo con `mario.body.touching.up` y el rebote mueve la imagen `4 px` durante `60 ms` con yoyo, sincronizando el body estático.

Decisiones tomadas:
- El ? Block entrega siempre un Super Mushroom y queda como tile `9`.
- El hongo liberado es estático y se recoge por overlap; su movimiento queda para `008`.
- El escenario esqueleto contiene un bloque de cada tipo, un hongo de prueba y un bloque lateral; `012` lo reemplaza.

Limitaciones:
- No hubo playtest manual humano ni video.
- El rebote no se capturó a mitad del tween; se verificó por logs, constante y estado final.
- La superficie pisable se comprobó sobre un Hard Block, no sobre el Empty Block.
- No se probaron múltiples contactos laterales/superiores distintos.
- El hongo no se mueve ni emerge con animación; eso es alcance de `008`.

Seguimiento:
- `008` reemplaza el hongo estático por el Super Mushroom con movimiento y aparición.
- `012` integra los bloques en el layout de World 1-1.
