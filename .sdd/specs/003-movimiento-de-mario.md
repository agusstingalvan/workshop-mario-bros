# SPEC: Movimiento horizontal y colisiones de Mario

## Problem and player or user value

Caminar, caer y pararse sobre el escenario es la base de todo el juego. Sin movimiento y colisiones correctas no se puede probar ningún bloque, enemigo o moneda. Esta spec entrega el primer control jugable.

## Current and expected behavior

**Actual**
- No existe Mario ni física de juego.
- La escena de plantilla solo muestra imágenes estáticas.

**Esperado**
- Mario camina a izquierda y derecha con velocidad controlada.
- Cae por gravedad y se detiene sobre suelo, plataformas, bloques y tuberías.
- Choca contra paredes, bloques y límites del mundo sin atravesarlos.
- Mira hacia la dirección en la que camina.
- Se anima con `mario_walk` (frames `[0, 1]`, 10 fps, loop) al moverse y queda en frame `[0]` al estar quieto.
- Usa origen `(0.5, 1)` y hitbox `16 × 22`.

## Related GDD or design reference

- §2.4. Personajes y enemigos (frames, origen, hitbox)
- §2.7. Reglas de uso del pixel art
- §3.1. Primer personaje
- §3.2. Mario y su movimiento
- §3.3. Estados de Mario (solo estado Small)
- §7.1. Suelo y plataformas

## Scope

- Entidad Mario en estado Small con sprite, origen y cuerpo arcade de `16 × 22`.
- Entrada de movimiento horizontal (izquierda/derecha).
- Gravedad y caída.
- Colisión con suelos y plataformas estáticas, paredes y bloques.
- Límite izquierdo y derecho del mundo.
- Animación `mario_walk` y volteo horizontal del sprite.
- Separación entre lógica de movimiento y presentación.

## Non-scope

- Salto, input buffer y coyote time (`004`).
- Estados Small/Super, daño e invulnerabilidad (`005`).
- Cámara y límites del nivel (`012`).
- Enemigos, bloques interactivos y objetos.
- Animaciones de reposo, salto, caída, daño o muerte: el pack no las trae (§2.4).

## Constraints and assumptions

- Valores de tuning centralizados en constantes; no dispersos en la escena.
- **Tuning asumido** (unidades de mundo, sin zoom):
  - Velocidad máxima de caminata: `100 px/s`.
  - Aceleración en suelo: `800 px/s²`; frenado: `1200 px/s²`.
  - Aceleración en aire: `600 px/s²`; sin frenado automático en aire.
  - Gravedad de caída: `2100 px/s²`; gravedad de subida: `1200 px/s²` (compartida con `004`).
  - Velocidad terminal: `600 px/s`.
  - Animación `mario_walk`: 10 fps, loop (GDD §2.4).
- Movimiento con aceleración y fricción, no velocidad instantánea.
- Mario puede cambiar de dirección en el aire.
- Entrada: flechas izquierda/derecha y `A`/`D`.
- No hay multiplicador de carrera.
- Mario no puede salir del mundo por los bordes laterales.
- Se implementa con el tuning asumido; el ajuste fino queda para playtest humano.
- No hay scroll vertical. El mundo provisional mide `1024 × 768` hasta que `012` defina el nivel.
- El nivel esqueleto incluye un escenario de prueba (suelo, plataforma, bloque, tubería y pared) para verificar colisiones; `012` lo reemplaza.

## Acceptance criteria

- [ ] Mario se mueve a izquierda y derecha con las teclas de movimiento y se detiene al soltar.
- [ ] Mario cae por gravedad y se apoya sobre el suelo sin hundirse ni vibrar.
- [ ] Mario no atraviesa paredes, bloques ni tuberías.
- [ ] Mario se detiene en los bordes laterales del mundo.
- [ ] El sprite se voltea según la dirección y la animación `mario_walk` se reproduce solo al moverse.
- [ ] Al quedar quieto se muestra el frame `[0]` sin animación.
- [ ] La hitbox efectiva mide `16 × 22` y el origen es `(0.5, 1)`.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura o video corto caminando, chocando y cayendo.
- Playtest manual de los criterios.
- Constantes de movimiento documentadas en el código.

## Open questions

- ¿El tuning asumido se valida en playtest o se ajusta antes de implementar?
- ¿El mundo tiene scroll vertical? Lo define `012`; esta spec solo asume colisiones laterales.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
