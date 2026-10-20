# Evidence: Salto y sensación de control

## Source records
- Spec: `.sdd/specs/004-salto-y-sensacion.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/004-salto-y-sensacion.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Presionar salto con Mario en el suelo lo eleva y lo devuelve al suelo | CDP: Espacio 80 ms sobre la plataforma; capturas a los 250 ms y 950 ms | Aire y luego suelo | `004-salto-normal-aire.png` muestra a Mario por encima de la plataforma; `004-salto-normal-suelo.png` lo muestra de nuevo apoyado | `.sdd/evidence/004-salto-normal-aire.png`, `.sdd/evidence/004-salto-normal-suelo.png` | Sin video; la secuencia se reconstruye con dos capturas |
| La caída es perceptiblemente más rápida que la subida | Constantes `GRAVITY_RISING 1200` / `GRAVITY_FALLING 2100`; observación de las capturas | Caída más rápida | La gravedad de caída es 1.75× la de subida; la altura máxima y el retorno se observan en las capturas | `src/game/constants/movement.js`; `004-salto-normal-aire.png` | No se midió la velocidad con instrumentación; playtest humano pendiente |
| Mantener presionado salto no produce saltos repetidos | CDP: mantener Espacio 1200 ms y capturar | Mario en suelo tras un solo salto | `004-salto-mantenido.png` muestra a Mario apoyado en la plataforma | `.sdd/evidence/004-salto-mantenido.png` | La captura no descarta un salto repetido instantáneo; el código usa `JustDown` y consume el buffer |
| Presionar salto durante la ventana previa al aterrizaje ejecuta el salto al tocar suelo | CDP: salto, segunda pulsación a los 530 ms (el primer salto dura ≈580 ms) y captura 200 ms después | Mario en el aire por el segundo salto | `004-buffer.png` muestra a Mario alto sobre la plataforma; el primer salto ya habría terminado a esa altura de tiempo | `.sdd/evidence/004-buffer.png` | La ventana se infiere del tiempo de vuelo teórico; no se instrumentó el estado interno |
| Caminar fuera de una plataforma y saltar dentro del coyote produce salto | CDP: caminar a la derecha 560 ms, Espacio 80 ms, captura 250 ms después | Mario en el aire | `004-coyote-dentro.png` muestra a Mario por encima de la plataforma, a la derecha de su borde | `.sdd/evidence/004-coyote-dentro.png` | El instante exacto de salida de la plataforma se estimó por cinemática |
| Pasada la ventana de coyote, el salto no se ejecuta | CDP: caminar a la izquierda 700 ms, Espacio 80 ms, captura 300 ms después | Mario sigue cayendo o en suelo, sin salto | `004-coyote-fuera.png` y `004-coyote-fuera-suelo.png` muestran a Mario en el suelo, sin elevación | `.sdd/evidence/004-coyote-fuera.png`, `.sdd/evidence/004-coyote-fuera-suelo.png` | La pulsación tardía tampoco entra en buffer porque expira antes del aterrizaje |
| El salto alcanza la altura necesaria para superar los bloques del nivel aprobado en `012` | Cálculo teórico: `400² / (2 × 1200) ≈ 66.7 px` (≈3.7 tiles) | Altura suficiente | Se midió la altura teórica; el layout de `012` todavía no está aprobado | `src/game/constants/movement.js` | **No verificable todavía**: `012` no tiene layout aprobado |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 004 implementada y verificada en sus casos observables. Mario salta con impulso `-400 px/s`, gravedad asimétrica (`1200` subiendo / `2100` cayendo), buffer de `120 ms` y coyote de `100 ms`; en el aire muestra el frame `[1]`.

Constantes (`src/game/constants/movement.js`):
- `JUMP_VELOCITY -400`, `JUMP_BUFFER_MS 120`, `COYOTE_TIME_MS 100`.
- `GRAVITY_RISING 1200`, `GRAVITY_FALLING 2100`, `TERMINAL_VELOCITY 600`.

Decisiones tomadas:
- Sin salto variable; el GDD solo pide subida suave y caída rápida.
- La plataforma de prueba subió de `620` a `540` para separar coyote de buffer durante la verificación.
- La altura de ≈66 px se valida contra `012` cuando exista un layout aprobado.

Limitaciones:
- No hubo playtest manual humano ni video; la verificación es automatizada con capturas.
- No se instrumentó el estado interno de buffer/coyote: la evidencia combina tiempos de vuelo teóricos con capturas.
- CDP requiere mantener la tecla ~80 ms; `keydown` y `keyup` en el mismo frame no registran `JustDown`. Es una limitación del método de prueba, no del juego.
- La suficiencia de la altura del salto contra el nivel de `012` queda pendiente.

Seguimiento:
- La spec 005 reutiliza el frame `[1]` y los estados Small/Super.
- La spec 009 usará el rebote sobre enemigos (`-300 px/s`).
- La spec 012 debe confirmar que los bloques del layout son alcanzables con ≈66 px.
