# SPEC: Salto y sensación de control

## Problem and player or user value

El GDD pide explícitamente un salto «más cómodo y agradable» que el de un personaje genérico. La diferencia está en tres detalles: subida suave, caída rápida, buffer de entrada y coyote time. Sin ellos el juego se siente injusto y los saltos al límite fallan.

## Current and expected behavior

**Actual**
- No existe salto.

**Esperado**
- Al presionar salto, Mario sube y vuelve a caer.
- La subida es más lenta que la caída (gravedad asimétrica).
- Si el jugador presiona salto poco antes de tocar el suelo, Mario salta al aterrizar (input buffer).
- Si Mario acaba de salir de una plataforma, conserva un instante para saltar (coyote time).
- Una pulsación mantenida no repite saltos.
- Durante salto y caída se muestra el frame `[1]`, sin animación propia.

## Related GDD or design reference

- §2.4. Mario quieto / salto / caída
- §3.1. Primer personaje
- §3.2. Mario y su movimiento (INPUT BUFFER, COYOTE TIME)
- §7.1. Suelo y plataformas

## Scope

- Entrada de salto con una sola activación por pulsación.
- Impulso vertical y gravedad asimétrica (subida vs caída).
- Ventana de input buffer al aterrizar.
- Ventana de coyote time al abandonar una plataforma.
- Reset de ambas ventanas al aterrizar o al consumir el salto.
- Frame `[1]` durante el aire.
- Constantes de salto centralizadas.

## Non-scope

- Salto variable por tiempo de pulsación: el GDD no lo pide (ver preguntas abiertas).
- Salto sobre enemigos y rebote (`009`).
- Estados Super y daño (`005`).
- Sonido de salto.

## Constraints and assumptions

- **Tuning asumido** (unidades de mundo, sin zoom):
  - Impulso de salto: `-400 px/s` en Y.
  - Gravedad de subida: `1200 px/s²`; gravedad de caída: `2100 px/s²`; velocidad terminal `600 px/s`.
  - Altura máxima teórica: ≈`66 px` (≈3.7 tiles de 18 px).
  - Ventana de input buffer: `120 ms`.
  - Ventana de coyote time: `100 ms`.
- Entrada de salto: `Espacio`, `↑` o `W`.
- Una pulsación mantenida no repite saltos.
- El coyote time solo aplica cuando Mario abandona una superficie sin saltar, no después de un salto.
- El buffer no debe disparar dos saltos seguidos con una sola pulsación.
- Las ventanas se miden en milisegundos y viven en constantes de tuning.
- Se implementa sin salto variable: el GDD solo pide subida suave y caída rápida.
- La altura de ≈3.7 tiles se mide en esta spec (≈66 px); su suficiencia contra el layout queda para `012`, que aún no tiene layout aprobado.
- El playtest humano queda pendiente; la verificación automatizada cubre los casos de buffer y coyote.

## Acceptance criteria

- [ ] Presionar salto con Mario en el suelo lo eleva y lo devuelve al suelo.
- [ ] La caída es perceptiblemente más rápida que la subida.
- [ ] Mantener presionado salto no produce saltos repetidos.
- [ ] Presionar salto durante la ventana previa al aterrizaje ejecuta el salto inmediatamente al tocar suelo.
- [ ] Caminar fuera de una plataforma y presionar salto dentro de la ventana de coyote produce salto.
- [ ] Pasada la ventana de coyote, el salto no se ejecuta.
- [ ] El salto alcanza la altura necesaria para superar los bloques del nivel aprobado en `012`.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Video corto o captura de los cuatro casos: salto normal, buffer, coyote y salto fuera de ventana.
- Constantes de salto documentadas (velocidad inicial, gravedad de subida, gravedad de caída, buffer ms, coyote ms).
- Playtest manual registrado.

## Open questions

- ¿La altura de ≈3.7 tiles alcanza todos los bloques del layout aprobado en `012`?
- ¿Salto variable según cuánto se mantiene presionado? El GDD solo describe subida suave y caída rápida; se asume que no.

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
