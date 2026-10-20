# SPEC: Monedas

## Problem and player or user value

Las monedas son la recompensa inmediata del recorrido y la única fuente de puntos definida en el GDD. Dan ritmo al nivel y alimentan el HUD.

## Current and expected behavior

**Actual**
- No existen monedas ni contadores.

**Esperado**
- Las monedas están distribuidas por el escenario.
- Al tocarlas, desaparecen, suman 1 al contador de monedas y 100 puntos.
- La moneda se dibuja con el tile `151` y un giro simulado con `scaleX`.
- La hitbox de recolección es `14 × 14`.

## Related GDD or design reference

- §2.5. Coin (tile `151`)
- §2.7. Hitboxes
- §5.1. Moneda
- §8.1. Puntos
- §9. HUD (COINS, SCORE)
- §10. Diseño del nivel (monedas distribuidas)

## Scope

- Entidad moneda con sprite de frame fijo `151` y animación de giro por `scaleX`.
- Overlap con Mario y recolección única.
- Emisión de un evento de recolección con valor 1 moneda / 100 puntos.
- Destrucción o devolución al pool al recoger.
- API para colocar monedas desde los datos del nivel.

## Non-scope

- Render y actualización del HUD (`013`).
- Monedas dentro de bloques: el ? Block entrega hongo (§4.3).
- Regla de vida extra por 100 monedas: no está en el GDD.
- Sonido de recolección.

## Constraints and assumptions

- **Tuning asumido**: giro continuo con `scaleX` de `1 → 0.2 → 1` en `600 ms` con easing senoidal, en loop.
- La recolección se resuelve por overlap, no por colisión física.
- El puntaje y el contador son estado de partida, no de la entidad.
- Una moneda no puede contarse dos veces aunque el overlap ocurra en frames consecutivos.
- En el escenario de prueba las monedas flotan a la altura de la cabeza, en una fila de tres; el layout final lo define `012`.
- El HUD mínimo existente se actualiza al recoger para poder evidenciar contadores; `013` lo reemplaza por el definitivo.

## Acceptance criteria

- [ ] Al tocar una moneda, desaparece en el mismo frame o inmediatamente después.
- [ ] El contador de monedas aumenta exactamente en 1.
- [ ] El puntaje aumenta exactamente en 100.
- [ ] Una moneda recogida no vuelve a sumar.
- [ ] La animación de giro es visible y no deforma la celda de `18 × 18`.
- [ ] La hitbox de recolección es `14 × 14`.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura del HUD antes y después de recoger una moneda.
- Video corto del giro.
- Playtest manual de recolección repetida.

## Open questions

- ¿Las monedas flotan en el aire o se apoyan sobre el suelo? Depende del layout de `012`.
- ¿Se agrupan en filas o están dispersas?

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
