# Plan: Carga de assets y reglas de pixel art

## Source spec
- Path: `.sdd/specs/001-carga-de-assets-y-pixel-art.md`
- Approval status: approved (aguss, 2026-10-19)

## Repository evidence

- `src/game/scenes/Game.js` es la escena de plantilla: carga `background` y `logo` desde `assets/`.
- `src/game/main.js` configura Phaser en 1024 × 768 con `Scale.FIT` y `Scale.CENTER_BOTH`, sin opciones de pixel art.
- `public/assets/` solo contiene `bg.png` y `logo.png`; las hojas fuente están en `assets/tilemap_packed.png` (360 × 162) y `assets/tilemap-characters_packed.png` (216 × 72).
- No existe módulo de constantes ni configuración de filtro.
- `docs/GDD.md` §2.1–§2.5 y §2.7 fijan celdas, frames, rects, orígenes, hitboxes y reglas de render.
- Decisiones de la revisión: conservar `bg.png` y `logo.png` sin usarlos; validar la escena base a escala ×4.

## Proposed steps
1. Copiar las dos hojas a `public/assets/`.
   Criteria covered: ambas hojas servidas sin 404.
2. Crear `src/game/constants/assets.js` con keys de textura, frames, rects, orígenes, hitboxes y secuencias de tiles de §2.4 y §2.5.
   Criteria covered: único módulo de constantes; sin índices repetidos en escenas.
3. Cargar las hojas como spritesheets en la escena base usando las constantes.
   Criteria covered: `tiles` 180 frames de 18 × 18 y `characters` 27 frames de 24 × 24.
4. Configurar `pixelArt: true`, `antialias: false` y `roundPixels: true` en `src/game/main.js`; agregar `image-rendering: pixelated` al canvas en `public/style.css`.
   Criteria covered: filtro nearest y sin suavizado al escalar.
5. Reemplazar el contenido de `src/game/scenes/Game.js` por una escena base que muestre un tile y un personaje a escala entera ×4, con etiquetas y conteo de frames.
   Criteria covered: escena base válida, sin errores de consola.
6. Verificar con `npm run build`, servidor de desarrollo y comprobación de frames/dimensiones.
   Criteria covered: build sin errores, hojas servidas, conteo verificado.

## Files and symbols

- `public/assets/tilemap_packed.png` (nuevo, copia)
- `public/assets/tilemap-characters_packed.png` (nuevo, copia)
- `src/game/constants/assets.js` (nuevo): `TEXTURES`, `ORIGINS`, `HITBOXES`, `TILES`, `TILE_SEQUENCES`, `CHARACTERS`
- `src/game/main.js`: configuración de render
- `src/game/scenes/Game.js`: `preload`, `create` y helpers privados de la escena base; `PREVIEW_SCALE = 4` como constante local de validación
- `public/style.css`: render del canvas

## Verification

- `npm run build` sin errores.
- `npm run dev` y `curl -I` a `/assets/tilemap_packed.png` y `/assets/tilemap-characters_packed.png` → HTTP 200.
- Comprobar dimensiones de las hojas (360 × 162 y 216 × 72) y frames calculados (180 y 27).
- Playtest manual de la escena base a ×4 para confirmar ausencia de suavizado y lectura del HUD de validación.

## Stopping conditions

- Las hojas en `assets/` no coinciden con las dimensiones del GDD.
- Phaser 4 no acepta las opciones de render previstas.
- El build falla por causas ajenas a este cambio.
- Aparece necesidad de definir animaciones, nivel o cámara (fuera de alcance).
