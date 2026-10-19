# GDD to SDD alignment

**GDD:** `docs/GDD.md`
**Fecha:** 2026-10-19
**Estado:** los specs están en `draft`; ninguno fue aprobado.

## GDD elements covered by specs

| GDD | Elemento | Spec |
|---|---|---|
| §2.1–2.3, §2.7 | Hojas de sprites, carga y reglas de pixel art | `001` |
| §2.4 | Frames, rects, orígenes y hitboxes de personajes | `001`, `003`, `005`, `009`, `010` |
| §2.5 | Tiles de escenario, bloques, objetos y HUD | `001`, `006`–`014` |
| §2.6 | Elementos sin asset directo (? Block, ladrillo, bandera, tuberías, Super Mario, Piranha) | `006`, `010`, `011`, `014` |
| §3.1–3.2 | Caminar, saltar, caer, colisiones, buffer y coyote | `003`, `004` |
| §3.3 | Small / Super, romper ladrillos, daño e invulnerabilidad | `005` |
| §4.1–4.4 | Hard, Brick, ? y Empty Block | `006` |
| §5.1 | Moneda, +1 moneda, +100 puntos | `007` |
| §5.2 | Super Mushroom, aparición, movimiento, efecto | `008` |
| §6.1 | Goomba: patrulla, daño lateral, aplastamiento y rebote | `009` |
| §6.2 | Piranha Plant: ciclo, daño, no se puede derrotar | `010` |
| §7.1–7.3 | Suelo, plataformas, tuberías y pozos | `011` |
| §7.4 | Goal Pole y fin de nivel | `014` |
| §8.1–8.2 | Puntos y vidas | `005`, `013`, `015` |
| §9 | HUD SCORE / COINS / LIVES / WORLD | `013` |
| §10 | Nivel World 1-1 | `012` |
| §11.1–11.2 | Main Menu y World Screen | `002` |
| §11.3 | Nivel jugable | `012` |
| §11.4 | Game Over y reinicio | `015` |
| §12 | Recorrido del juego | `002`, `012`, `014`, `015` |
| §13 | Alcance | Todos |

## GDD elements without specs

Todos los elementos del GDD §13 tienen al menos un spec asociado. Lo que el GDD no define se resolvió por decisión o queda pendiente:

1. **Layout del nivel (§10).** El GDD enumera elementos y una progresión cualitativa, pero no da un mapa, medidas ni posiciones. `012` queda a la espera de un bosquejo o de una decisión de libertad de diseño.
2. **Tuning.** Asumido y fijado en cada spec. Resumen:
   - Mario: caminata `100 px/s`, aceleración `800 px/s²`, frenado `1200 px/s²`, aire `600 px/s²`.
   - Salto: impulso `-400 px/s`, gravedad de subida `1200 px/s²`, de caída `2100 px/s²`, terminal `600 px/s`, buffer `120 ms`, coyote `100 ms`.
   - Daño: invulnerabilidad `1500 ms`, parpadeo cada `100 ms`.
   - Objetos y enemigos: hongo `60 px/s` con emersión de `18 px` en `300 ms`; Goomba `35 px/s`, rebote `-300 px/s`, aplastado `100 ms`.
   - Escenario: rebote de bloque `4 px` en `120 ms`; giro de moneda `600 ms`; nivel `3780 × 288 px`; cámara con zoom `3` y lerp `0.1`; World Screen `2000 ms`.
3. **Resolución lógica y zoom.** Asumidos: canvas 1024 × 768, zoom `3`, viewport de `341 × 256 px` de mundo.
4. **Sonido y música.** Fuera de alcance por decisión; no se mencionan en el GDD.
5. **Puntaje por enemigos.** Resuelto: `0` puntos; §8.1 solo puntúa monedas.
6. **Vida extra por monedas.** Resuelto: no existe en esta versión.
7. **Título del juego.** §11.1 dice «el título del videojuego» sin fijarlo; queda pendiente.
8. **Piranha Plant y posición de Mario.** Resuelto: ciclo constante de 6.4 s, sin depender de la posición del jugador.
9. **Repetición de la World Screen.** Queda pendiente qué pasa al volver al menú y jugar de nuevo; se asume que se repite la transición.

## Specs without explicit GDD support

- **`001` Carga de assets y pixel art.** Es una spec de ingeniería: no agrega comportamiento de juego, pero materializa §2.3 y §2.7 y es prerequisito de todas las demás. Sí tiene respaldo parcial en el GDD.
- **Escena base / módulo de constantes** dentro de `001` y **formato de datos de nivel** dentro de `012` son decisiones técnicas, no requisitos de diseño.
- No hay specs que agreguen features ausentes del GDD.

## Contradictions or assumptions

1. **Assets fuera de `public/`.** Las hojas están en `assets/` (raíz) y `public/assets/` solo contiene `bg.png` y `logo.png`. La ruta de carga del GDD §2.3 no resuelve hoy. Lo cubre `001`.
2. **`src/game/scenes/Game.js` es la plantilla.** Carga `bg.png`/`logo.png` y muestra un cartel. Cualquier spec de pantallas la reemplaza; falta decidir si se elimina o se renombra.
3. **«Tres tipos principales de bloques» (§13) vs. cuatro tipos (§4).** §4 lista Hard, Brick, ? y Empty. Se interpreta que Empty no cuenta como tipo principal. Sin impacto funcional.
4. **Super Mario `scale 1.5`.** La celda es `24 × 24`; escalada ocupa `36 × 36`, pero la hitbox documentada es `20 × 26`. Es coherente (la hitbox es independiente), aunque el sprite puede solaparse visualmente con bloques cercanos. Requiere validación en playtest.
5. **Hitbox de moneda `14 × 14`** con celda `18 × 18`: correcto según §2.7, pero implica que el borde de la moneda no recolecta.
6. **Pérdida de vida y contadores.** Regla confirmada: §8.2 reinicia la posición y el estado de Mario, y §11.4 reinicia los contadores solo al comenzar una partida nueva. Por lo tanto, **perder una vida no reinicia puntaje ni monedas**.
7. **Piranha Plant sin asset.** Es el único elemento generado por código; su fidelidad visual no se puede validar contra el pack, solo contra la tabla de §2.6.
8. **Tuberías azules.** El GDD las llama «tuberías verdes» en el título de §2.6 pero exige el color azul original. Se sigue el color, no la palabra.
9. **`WORLD 1-1` en el HUD.** §9 lista `WORLD` como campo del HUD; §11.2 lo usa en la World Screen. Se asume que el HUD lo muestra de forma fija.

## Human decisions required

1. **Aprobar o corregir la descomposición** en 15 specs (¿fusionar `003`+`004`, `007`+`008`, `014`+`015`?).
2. **Resolver el layout de `012`**: entregar un bosquejo o autorizar libertad de diseño.
3. **Definir el título del juego** y confirmar el input del menú (mouse/teclado).
4. **Confirmar el alcance de audio** (dentro o fuera del workshop).
5. **Aprobar el orden de implementación** sugerido: `001` → `002` → `003` → `004` → `011` → `012` (esqueleto) → `006` → `007` → `013` → `005` → `008` → `009` → `010` → `014` → `015`.
