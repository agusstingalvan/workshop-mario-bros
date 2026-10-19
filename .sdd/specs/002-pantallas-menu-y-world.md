# SPEC: Main Menu y World Screen

## Problem and player or user value

El recorrido del juego (§12) empieza en un menú y pasa por una pantalla de mundo antes del nivel. Hoy no existe ninguna de las dos: al abrir el juego aparece la escena de plantilla. Sin este flujo el jugador no tiene forma de iniciar una partida.

## Current and expected behavior

**Actual**
- `src/game/main.js` registra una sola escena, `Game`, que muestra la plantilla de Phaser.
- No hay navegación entre pantallas ni estado de partida.

**Esperado**
1. Al abrir el juego aparece el Main Menu con el título del juego y un botón «Jugar».
2. Al activar «Jugar» se pasa a la World Screen, que muestra `WORLD 1-1` centrado.
3. Tras una espera breve, arranca el nivel con Small Mario, 3 vidas y contadores en cero.
4. El flujo no permite volver al menú por accidente durante la espera.

## Related GDD or design reference

- §11.1. Menú principal
- §11.2. Pantalla del mundo
- §11.3. Nivel — World 1-1
- §12. Recorrido del juego (pasos 1–4)

## Scope

- Escena Main Menu: título y botón «Jugar».
- Escena World Screen: texto `WORLD 1-1` centrado y transición temporizada.
- Escena del nivel como esqueleto navegable (sin gameplay propio).
- Registro de las escenas en `src/game/main.js` y navegación entre ellas.
- Estado inicial de partida: 3 vidas, puntaje 0, monedas 0, mundo `1-1`.

## Non-scope

- Game Over y reinicio de partida (`015`).
- Pausa, opciones, créditos.
- Contenido visual del nivel (`012`).
- Sonido y música.

## Constraints and assumptions

- Los textos se dibujan con `Phaser.GameObjects.Text`; la hoja solo trae dígitos (§9, §11).
- El canvas se mantiene en 1024 × 768 con `Scale.FIT` y `Scale.CENTER_BOTH`.
- La World Screen no requiere assets nuevos.
- **Tuning asumido**: la World Screen dura `2000 ms` antes de iniciar el nivel.
- El botón «Jugar» responde tanto a mouse como a teclado.

## Acceptance criteria

- [ ] Al cargar la aplicación aparece el Main Menu con el título y el botón «Jugar».
- [ ] Activar «Jugar» navega a la World Screen sin errores.
- [ ] La World Screen muestra `WORLD 1-1` centrado.
- [ ] Tras la espera definida, la World Screen inicia el nivel automáticamente.
- [ ] Al iniciar el nivel, Small Mario aparece en el punto de inicio y el estado de partida es 3 vidas, 0 monedas y 0 puntos.
- [ ] Durante la World Screen no se puede reiniciar la transición ni volver al menú por accidente.
- [ ] `npm run build` termina sin errores.

## Evidence expected

- Captura del Main Menu y de la World Screen.
- Captura del nivel recién iniciado con el HUD en valores iniciales.
- Registro del tiempo de espera configurado.

## Open questions

- ¿Cuál es el título exacto que se muestra? El GDD no lo fija.
- ¿La World Screen es solo texto o lleva fondo/animación?
- ¿Se respeta el orden de escenas `Boot → Menu → World → Level` o se precargan assets en una escena aparte?

## Human approval

- Status: draft
- Approved by:
- Date:
