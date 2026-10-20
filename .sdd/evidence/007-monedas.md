# Evidence: Monedas

## Source records
- Spec: `.sdd/specs/007-monedas.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/007-monedas.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Al tocar una moneda, desaparece en el mismo frame o inmediatamente después | Caminar sobre la primera moneda y capturar | Moneda ausente | `007-despues.png` ya no muestra la moneda recogida | `.sdd/evidence/007-despues.png` | — |
| El contador de monedas aumenta exactamente en 1 | HUD y log tras la primera recolección | `COINS 01` | HUD `COINS 01`; log `coins 1` | `.sdd/evidence/007-despues.png` | — |
| El puntaje aumenta exactamente en 100 | HUD y log tras la primera recolección | `MARIO 000100` | HUD `MARIO 000100`; log `score 100` | `.sdd/evidence/007-despues.png` | — |
| Una moneda recogida no vuelve a sumar | Recoger tres monedas y contar logs | Exactamente 3 recolecciones, 300 puntos | `coins 1`, `coins 2`, `coins 3`; `score 100`, `200`, `300`; HUD final `COINS 03` y `MARIO 000300` | `.sdd/evidence/007-tres-monedas.png` | La protección contra doble conteo también está en `Coin.collect()` |
| La animación de giro es visible y no deforma la celda de `18 × 18` | Seis capturas separadas 100 ms | Ancho variable entre frames y celda fija | `007-giro-0.png` a `007-giro-5.png` muestran monedas angostas y anchas alternando | `.sdd/evidence/007-giro-2.png`, `.sdd/evidence/007-giro-3.png` | La celda no se deforma porque solo se tweenea `scaleX`; no se midió el ancho en píxeles |
| La hitbox de recolección es `14 × 14` | Log de creación de cada moneda | `14 × 14` | `[coin] hitbox 14×14` tres veces | Log de consola de la corrida | — |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 007 implementada y verificada. Las monedas usan el tile `151`, giran con un tween de `scaleX` de `1 → 0.2 → 1` en `600 ms`, tienen body `14 × 14` y recolección única por overlap. Cada moneda suma `1` moneda y `100` puntos en `GameState`; el HUD mínimo se actualiza para evidenciarlo.

Decisiones tomadas:
- Las monedas de prueba flotan a la altura de la cabeza, en una fila de tres; el layout final queda para `012`.
- El HUD mínimo se actualiza al recoger; `013` lo reemplaza por el HUD definitivo.
- La recolección emite `COIN_COLLECTED_EVENT` y la entidad se destruye.

Limitaciones:
- No hubo playtest manual humano ni video.
- El giro se verificó con una secuencia de capturas, no como video.
- El ancho del giro no se midió en píxeles.
- No se probó la recolección desde el aire ni con Super Mario; el overlap no depende del estado.

Seguimiento:
- `012` define la distribución real de monedas y si flotan o se apoyan.
- `013` reemplaza el HUD de texto por el definitivo.
