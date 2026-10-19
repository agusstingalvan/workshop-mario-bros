# SPEC: Carga de assets y reglas de pixel art

## Problem and player or user value

Hoy el proyecto es la plantilla de Phaser: carga `bg.png` y `logo.png` y muestra un cartel de bienvenida. Sin las hojas de Kenney disponibles en runtime no se puede construir ningún elemento del juego, y sin reglas de render compartidas el pixel art se verá borroso o desalineado. Esta spec habilita todas las demás.

## Current and expected behavior

**Actual**
- `src/game/scenes/Game.js` carga solo `background` y `logo` desde `assets/`.
- `public/assets/` contiene únicamente `bg.png` y `logo.png`.
- Los spritesheets fuente viven en `assets/` (raíz), fuera de la carpeta servida por Vite.
- No existe configuración de filtro nearest ni un módulo de constantes de frames.

**Esperado**
- Las dos hojas se sirven desde `public/assets/` y se cargan como spritesheets con las dimensiones del GDD.
- El render usa filtro nearest, sin antialias, y escalas enteras.
- Las referencias a frames, rects, orígenes y hitboxes viven en un único módulo reutilizable.
- El juego arranca en una escena base sin errores de consola.

## Related GDD or design reference

- §2. Estilo visual y recursos
- §2.1. Hojas de sprites disponibles
- §2.2. Convención de referencia
- §2.3. Carga en Phaser
- §2.4. Personajes y enemigos
- §2.5. Escenario, bloques, objetos y HUD
- §2.7. Reglas de uso del pixel art

## Scope

- Copiar `assets/tilemap_packed.png` y `assets/tilemap-characters_packed.png` a `public/assets/`.
- Cargar `tiles` (`18 × 18`, 180 frames) y `characters` (`24 × 24`, 27 frames) con las llamadas del GDD §2.3.
- Configurar el render con filtro nearest y sin antialias; desactivar suavizado al escalar.
- Crear un módulo de constantes con keys de textura, índices de frame, rects, origen e hitboxes de §2.4 y §2.5.
- Sustituir la escena de plantilla por una escena base mínima (sin gameplay) que valide la carga.

## Non-scope

- Animaciones de gameplay (`mario_walk`, `goomba_walk`, etc.).
- Texturas generadas de Piranha Plant (§2.6) — corresponden a `010`.
- Nivel, cámara, HUD, menú y cualquier regla de juego.
- Sonido y música.

## Constraints and assumptions

- El índice de frame de Phaser coincide con el índice de celda del GDD (§2.3).
- No se recortan celdas: siempre `18 × 18` o `24 × 24` (§2.7).
- Escalas solo en múltiplos enteros, con la única excepción documentada de Super Mario (`scale 1.5`).
- Las hitboxes no coinciden con la celda: jugador `16 × 22`, caja `16 × 14`, moneda `14 × 14`, planta `12 × 10`.
- Se asume que las hojas fuente de `assets/` son las definitivas y no requieren reprocesamiento.

## Acceptance criteria

- [ ] `npm run dev` sirve ambas hojas en `http://localhost:8080/assets/...` sin respuestas 404.
- [ ] En runtime `tiles` expone 180 frames de `18 × 18` y `characters` 27 frames de `24 × 24`.
- [ ] La escena base muestra al menos un tile y un personaje sin suavizado apreciable al escalar.
- [ ] Existe un único módulo de constantes de assets; ninguna escena repite índices de frame a mano.
- [ ] `npm run build` termina sin errores y la escena base no arroja errores en consola.

## Evidence expected

- Salida de `npm run build`.
- Captura de la escena base con el render ampliado para inspeccionar el filtro.
- Conteo de frames verificado en runtime (consola o inspector).
- Listado del módulo de constantes con los valores de §2.4 y §2.5.

## Open questions

- ¿Se conservan `bg.png` y `logo.png` para el menú o se descartan?
- ¿Qué resolución lógica y zoom usa el mundo? El GDD fija el canvas en 1024 × 768 pero no define zoom ni escala del nivel.
- ¿El escenario se construye con el sistema de tilemaps de Phaser o con sprites individuales por índice? El GDD define índices, no formato de mapa.
- ¿Se elimina `log.js` y la telemetría de la plantilla?

## Human approval

- Status: approved
- Approved by: aguss
- Date: 2026-10-19
