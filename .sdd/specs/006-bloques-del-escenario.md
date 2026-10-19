# SPEC: Bloques del escenario

## Problem and player or user value

Los bloques son la interacción central con el escenario: golpearlos desde abajo descubre objetos, y el estado de Mario decide si un ladrillo se rompe. Es el lazo que conecta movimiento, estados y objetos.

## Current and expected behavior

**Actual**
- No existen bloques ni colisiones interactivas.

**Esperado**

| Tipo | Small Mario | Super Mario |
|---|---|---|
| Hard Block (tile `11`) | Sube un poco y vuelve; no se rompe | Igual |
| Brick Block (tile `29`) | Sube un poco y vuelve; no se rompe | Se rompe y desaparece |
| ? Block (tile `10`) | Sube, entrega un Super Mushroom y queda como Empty Block | Igual |
| Empty Block (tile `9`) | Sólido, sin contenido, no se rompe | Igual |

- El golpe se detecta desde abajo (cabeza contra la cara inferior).
- El ? Block entrega el hongo una sola vez y nunca vuelve a entregar otro.
- El bloque vacío sigue siendo pisable y sólido.

## Related GDD or design reference

- §2.5. Escenario, bloques, objetos y HUD
- §2.6. Elementos sin asset directo
- §3.3. Estados de Mario (romper ladrillos)
- §4. Bloques del escenario (§4.1 a §4.4)
- §5.2. Super Mushroom (aparición desde el bloque)

## Scope

- Entidad bloque con variantes por tipo (polimorfismo, no condicionales por `type` dispersos).
- Detección de golpe desde abajo y respuesta de rebote vertical.
- Transformación `? Block → Empty Block` cambiando el frame.
- Ruptura de ladrillo solo en estado Super.
- Solicitud de aparición de hongo al sistema de objetos (`008`).
- Colisión sólida por los cuatro lados y superficie pisable.

## Non-scope

- Movimiento del hongo una vez liberado (`008`).
- Monedas contenidas en bloques: §4.3 define siempre un hongo.
- Partículas, escombros y sonido de rotura (ver preguntas abiertas).
- Layout y posiciones del nivel (`012`).

## Constraints and assumptions

- Frames y rects según §2.5: `11`, `10`, `9`, `29`, todos de `18 × 18`.
- **Tuning asumido**: el rebote desplaza el bloque `4 px` hacia arriba en `60 ms` y lo devuelve en otros `60 ms`.
- Un golpe desde abajo con Super rompe el ladrillo siempre; no hay escombros ni animación de rotura, el bloque simplemente desaparece.
- Un ladrillo roto libera el espacio y Mario puede pasar.
- El hongo aparece sobre el bloque, no dentro.
- La rotura no otorga puntos: el GDD solo puntúa monedas.

## Acceptance criteria

- [ ] Golpear un Hard Block desde abajo lo desplaza y lo devuelve a su lugar, sin romperse, con Small y con Super.
- [ ] Golpear un Brick Block con Small lo desplaza y lo devuelve sin romperse.
- [ ] Golpear un Brick Block con Super lo destruye y el espacio queda transitable.
- [ ] Golpear un ? Block entrega un hongo, se anima y queda mostrando el tile `9`.
- [ ] Un ? Block ya usado no entrega un segundo hongo.
- [ ] Un Empty Block es sólido, pisable y no entrega nada.
- [ ] Ningún bloque se rompe ni entrega objetos por contacto lateral o desde arriba.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Video o captura de los cuatro tipos de bloque con Small y con Super.
- Captura del ? Block antes y después del golpe.
- Playtest manual de colisión por los cuatro lados.
- Constantes de rebote documentadas.

## Open questions

- ¿El ? Block puede entregar monedas en alguna posición del nivel? §4.3 define siempre un hongo; se asume que no.

## Human approval

- Status: draft
- Approved by:
- Date:
