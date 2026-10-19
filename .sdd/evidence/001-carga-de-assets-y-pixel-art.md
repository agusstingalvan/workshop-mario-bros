# Evidence: Carga de assets y reglas de pixel art

## Source records
- Spec: `.sdd/specs/001-carga-de-assets-y-pixel-art.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/001-carga-de-assets-y-pixel-art.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| `npm run dev` sirve ambas hojas en `http://localhost:8080/assets/...` sin 404 | `npm run dev-nolog` + `curl` a `/assets/tilemap_packed.png` y `/assets/tilemap-characters_packed.png` | HTTP 200 en ambas | `packed: 200` y `characters: 200` | Servidor Vite local (detenido al terminar) | Verificado por HTTP; no se probaron rutas alternativas |
| En runtime `tiles` expone 180 frames de 18 × 18 y `characters` 27 frames de 24 × 24 | Escena base registra el conteo real de `Texture.getFrameNames()` en consola; Chrome headless con `--enable-logging=stderr` | `tiles: 180`, `characters: 27` | `[assets] tiles: 180/180 frames · 360×162 px · OK \| characters: 27/27 frames · 216×72 px · OK` | Log de consola de la corrida; ver también captura | El conteo depende del tamaño de hoja (360×162 y 216×72), verificado |
| La escena base muestra al menos un tile y un personaje sin suavizado apreciable al escalar | Corrida headless a 1024 × 768 y escala ×4; inspección visual de la captura | Bordes pixelados nítidos | Se ven hard block, ? block, small Mario y Goomba a ×4 con bordes duros | `.sdd/evidence/001-escena-base.png` | Inspección visual sobre captura headless; no se probó en otros navegadores ni con zoom del sistema |
| Existe un único módulo de constantes de assets; ninguna escena repite índices de frame a mano | Revisión de `src/game/scenes/Game.js`: solo importa `TEXTURES`, `TILES` y `CHARACTERS` | Un solo módulo y sin índices sueltos en la escena | `src/game/constants/assets.js` concentra texturas, frames, rects, orígenes, hitboxes y secuencias; la escena usa `TILES.HARD_BLOCK`, `TILES.QUESTION_BLOCK`, `CHARACTERS.SMALL_MARIO` y `CHARACTERS.GOOMBA` | `src/game/constants/assets.js` | — |
| `npm run build` termina sin errores y la escena base no arroja errores en consola | `npm run build`; corrida headless con logging | Build exitoso y consola sin errores | Build completado (`✨ Done ✨`); única advertencia: chunk > 500 kB; consola sin errores, solo logs informativos de Vite/Phaser y el reporte de assets | Salida de `npm run build` | La advertencia de tamaño de chunk es preexistente de la plantilla (Phaser) |

## Result and follow-up

Resultado: spec 001 implementada y verificada. Las hojas se sirven desde `public/assets/`, la escena base valida carga, frames y escala ×4, y el módulo de constantes queda listo para las specs 002–015.

Decisiones tomadas en revisión:
- `bg.png` y `logo.png` se conservan en `public/assets/` para el futuro menú, pero la escena base ya no los carga.
- La escena de validación usa escala entera ×4.
- El Goomba usa `crawler_blue` frames `[18, 19, 20]` como ciclo de caminata (8 fps) y el frame `18` para el estado aplastado; se actualizaron `docs/GDD.md` §2.4/§6.1/§10, la spec 009 y `src/game/constants/assets.js`.

Limitaciones:
- No hubo playtest manual humano; la verificación visual se hizo sobre una captura headless de Chrome.
- El filtro nearest se validó por configuración (`pixelArt`, `antialias: false`, `image-rendering: pixelated`) y por inspección de la captura, no con un análisis de píxeles automatizado.

Seguimiento:
- Specs 002+ consumen `src/game/constants/assets.js`; cualquier frame nuevo debe agregarse ahí.
- Quedan abiertas para specs posteriores: zoom del nivel, sistema de tilemap vs sprites individuales, y si se elimina `log.js`/telemetría.
- Spec 010 debe crear las texturas `piranha_open` y `piranha_closed`; por eso `CHARACTERS.PIRANHA_PLANT` tiene `texture: null` y solo conserva origen y hitbox.
