# Evidence: Movimiento horizontal y colisiones de Mario

## Source records
- Spec: `.sdd/specs/003-movimiento-de-mario.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/003-movimiento-de-mario.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Mario se mueve a izquierda y derecha con las teclas y se detiene al soltar | Chrome headless/CDP: ArrowRight 1.4 s, ArrowLeft 3.8 s, `D` 0.6 s; capturas durante y después | Desplazamiento y detención | Se observa a Mario desplazarse a la derecha, a la izquierda y con `D`; tras soltar queda quieto | `003-caminando-derecha.png`, `003-caminando-izquierda.png`, `003-movimiento-ad.png` | Sin video; la secuencia se reconstruye con capturas |
| Mario cae por gravedad y se apoya sobre el suelo sin hundirse ni vibrar | Spawn sobre la plataforma a `y = 560`; dos capturas separadas 500 ms tras aterrizar | Mario apoyado y frames idénticos | `idleStable: true`; Mario queda sobre la plataforma | `003-nivel-inicial.png`, `003-quieto.png` | La comparación es byte a byte sobre la captura, no análisis físico |
| Mario no atraviesa paredes, bloques ni tuberías | Caminar a la izquierda hasta la pared de 3 hard blocks; dos capturas tras soltar | Se detiene antes de la pared | `wallStable: true`; Mario queda apoyado contra la pared sin atravesarla | `003-colision-pared.png`, `003-colision-pared-quieto.png` | Bloque y tubería comparten el mismo `staticGroup` y collider, pero no se colisionaron individualmente porque la pared los tapa |
| Mario se detiene en los bordes laterales del mundo | Caminar a la derecha hasta el borde; dos capturas tras soltar | Se detiene en el borde | `edgeStable: true`; Mario queda en el borde derecho del canvas | `003-borde-derecho.png`, `003-borde-derecho-quieto.png` | Se verificó el borde derecho; el izquierdo está configurado con los mismos límites pero la pared impide alcanzarlo |
| El sprite se voltea según la dirección y `mario_walk` se reproduce solo al moverse | Capturas caminando en ambas direcciones y quieto | Sprite espejado al ir a la izquierda; pose de caminata en movimiento | En `003-caminando-izquierda.png` Mario mira a la izquierda; las capturas en movimiento muestran la pose de caminata y las quietas el frame 0 | `003-caminando-derecha.png`, `003-caminando-izquierda.png`, `003-quieto.png` | La animación no se inspeccionó frame por frame; se infiere de la pose y del código |
| Al quedar quieto se muestra el frame `[0]` sin animación | Dos capturas quietas separadas 500 ms | Frames idénticos | `idleStable: true`, `edgeStable: true`, `wallStable: true` | Capturas `*-quieto.png` | — |
| La hitbox efectiva mide `16 × 22` y el origen es `(0.5, 1)` | Log de `Mario` al construir el body, leído por consola | `16 × 22` y `(0.5, 1)` | `[mario] hitbox 16×22 · origen (0.5, 1)` | Log de consola de la corrida | — |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; solo advertencia preexistente de chunk > 500 kB | Salida de `npm run build` | — |

## Result and follow-up

Resultado: spec 003 implementada y verificada. Mario usa Arcade Physics con body `16 × 22`, movimiento con aceleración/frenado, gravedad variable, volteo y animación `mario_walk`.

Constantes (`src/game/constants/movement.js`):
- `MAX_SPEED 100`, `GROUND_ACCELERATION 800`, `GROUND_DECELERATION 1200`, `AIR_ACCELERATION 600`.
- `GRAVITY_RISING 1200`, `GRAVITY_FALLING 2100`, `TERMINAL_VELOCITY 600`.

Decisiones tomadas:
- Se usa el tuning asumido de la spec; el ajuste fino queda para playtest humano.
- Mundo provisional `1024 × 768`, sin scroll vertical, hasta que `012` defina el nivel.
- El escenario de prueba (suelo, plataforma, bloque, tubería y pared) es descartable y será reemplazado por `012`.
- Mario pasa de escala ×2 (spec 002) a escala 1, coherente con «sin zoom» y con la hitbox nativa `16 × 22`.

Limitaciones:
- No hubo playtest manual humano; la verificación fue automatizada con Chrome headless y CDP.
- No se generó video; la evidencia son capturas y comparación byte a byte de frames quietos.
- Bloque y tubería no se colisionaron individualmente: comparten el collider del `staticGroup` con la pared.
- No se implementó salto, cámara ni nivel real (specs 004 y 012).

Seguimiento:
- La spec 004 reutiliza `GRAVITY_RISING` y agrega salto, input buffer y coyote time.
- La spec 012 reemplaza el escenario de prueba y define el nivel y la cámara.
