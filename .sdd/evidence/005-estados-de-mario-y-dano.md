# Evidence: Estados de Mario y daño

## Source records
- Spec: `.sdd/specs/005-estados-de-mario-y-dano.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/005-estados-de-mario-y-dano.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Mario inicia la partida en estado Small con hitbox `16 × 22` | Log de Mario al crear la escena y captura inicial | `state small · 16×22` | `[mario] state small · hitbox 16×22 · escala 1` | `.sdd/evidence/005-small.png` | — |
| Recoger un hongo cambia a Super con `scale 1.5` y hitbox `20 × 26`, sin hundirse | Caminar al hongo; log y captura | Super visible y hitbox efectiva `20 × 26` | `[mario] state super · hitbox 20×26 · escala 1.5`; los pies siguen sobre la plataforma | `.sdd/evidence/005-super.png` | El hongo es andamiaje de prueba; lo reemplaza `008` |
| Un golpe de enemigo a Super lo devuelve a Small sin descontar vidas | Caminar al peligro; log de estado y HUD | Small y `LIVES 03` | `[mario] state small · hitbox 16×22` con `LIVES 03` | `.sdd/evidence/005-danado-super.png` | El peligro es andamiaje de prueba; lo reemplazan `009`/`010` |
| Un golpe de enemigo a Small descuenta una vida y reinicia el nivel en el punto de inicio | Permanecer en el peligro hasta que expire la invulnerabilidad | `LIVES 02` y Mario en el inicio | `[game] vida perdida · vidas restantes: 2`; respawn con `LIVES 02` | `.sdd/evidence/005-respawn.png` | — |
| Al perder una vida se conservan puntaje y monedas | Revisión de `GameState.loseLife()` y HUD tras el respawn | Contadores sin cambios | `loseLife()` solo modifica vidas; el HUD mantiene `MARIO 000000` y `COINS 00` | `src/game/state/GameState.js`, `.sdd/evidence/005-respawn.png` | Los contadores valen 0 porque 007/013 todavía no existen; no se probó con valores no nulos |
| Durante la invulnerabilidad, un segundo golpe no descuenta vida ni cambia de estado, y el parpadeo es visible | Permanecer sobre el peligro; medir tiempo entre `small` y la vida perdida; dos capturas separadas 100 ms | Sin vida perdida durante `1500 ms`; alpha alternado | La vida se perdió `1513 ms` después del golpe; `005-danado-super.png` muestra alpha bajo y `005-invulnerable.png` alpha pleno | `.sdd/evidence/005-danado-super.png`, `.sdd/evidence/005-invulnerable.png` | El alpha se verificó visualmente, no por análisis de píxeles |
| Caer en un pozo descuenta una vida y reinicia el nivel | Caminar al pozo y esperar la muerte | `LIVES 01` y Mario en el inicio | `[game] vida perdida · vidas restantes: 1`; respawn con `LIVES 01` | `.sdd/evidence/005-pozo.png` | El pozo es andamiaje; el pozo real lo define `011` |
| Al llegar a 0 vidas se dispara el flujo de Game Over | Caer al pozo con la última vida | Evento de Game Over y `LIVES 00` | `[game] vida perdida · vidas restantes: 0` y `[game] game over`; HUD muestra `LIVES 00` y la escena queda pausada | `.sdd/evidence/005-game-over.png` | La pantalla de Game Over es alcance de `015`; por ahora solo se emite `game-over` y se pausa |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 005 implementada y verificada en sus casos observables. Mario tiene máquina de estados `small`/`super`, transformación con hitbox efectiva `20 × 26`, daño con API pública, invulnerabilidad de `1500 ms` con parpadeo, pérdida de vida, respawn y disparo de Game Over.

Decisiones tomadas:
- La hitbox de Super es efectiva `20 × 26`: el body se compensa por la escala `1.5` para que la escala del sprite no infle el cuerpo a `30 × 39`.
- Sin animación ni pausa de muerte: respawn inmediato.
- Si Mario crece sin techo libre, se mantiene el crecimiento; el caso con bloques queda para `006`/`012`.
- El escenario de prueba incluye hongo, peligro rojo y pozo; son andamiaje y los reemplazan `008`, `009`/`010` y `011`.
- El HUD se actualiza al perder una vida para que el estado de 0 vidas sea visible; `013` lo reemplaza por el HUD definitivo.

Limitaciones:
- No hubo playtest manual humano ni video.
- Puntaje y monedas valen 0, así que la conservación de contadores se verificó por código y por HUD, no con valores no nulos.
- El parpadeo se verificó visualmente.
- La pantalla de Game Over no existe todavía: solo se emite el evento `game-over` y se pausa la escena.

Seguimiento:
- `008` reemplaza el hongo de prueba por el Super Mushroom real.
- `009`/`010` conectan el daño de enemigos a `Mario.takeDamage()`.
- `011` define el pozo real y su disparador de muerte.
- `015` escucha `GAME_OVER_EVENT` y muestra la pantalla de Game Over.
