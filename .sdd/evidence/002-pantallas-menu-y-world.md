# Evidence: Main Menu y World Screen

## Source records
- Spec: `.sdd/specs/002-pantallas-menu-y-world.md` (approved, aguss, 2026-10-19)
- Plan: `.sdd/plans/002-pantallas-menu-y-world.md`

## Verification by acceptance criterion

| Criterion | Verification command or manual steps | Expected result | Observed result | Evidence path or link | Limitations |
| --- | --- | --- | --- | --- | --- |
| Al cargar la aplicación aparece el Main Menu con título y botón «Jugar» | `npm run dev` + Chrome headless a 1024 × 768, captura inicial | Menú visible | `SUPER MARIO BROS`, subtítulo `Versión simplificada` y botón `Jugar` visibles | `.sdd/evidence/002-menu.png` | Verificado en Chrome headless; no en otros navegadores |
| Activar «Jugar» navega a la World Screen sin errores | Clic en `(512, 500)` vía CDP y captura a los 500 ms | World Screen visible, consola sin errores | La captura muestra la World Screen; el arreglo de errores quedó vacío | `.sdd/evidence/002-world.png` | — |
| El botón también responde a teclado | Enter vía CDP desde el menú y captura a los 500 ms | World Screen visible | La captura muestra la World Screen | `.sdd/evidence/002-world-teclado.png` | Solo se probó Enter; Espacio usa el mismo handler y no se ejercitó |
| La World Screen muestra `WORLD 1-1` centrado | Inspección de la captura | Texto centrado | `WORLD 1-1` centrado sobre fondo negro | `.sdd/evidence/002-world.png`, `.sdd/evidence/002-world-teclado.png` | — |
| Tras la espera definida, la World Screen inicia el nivel automáticamente | `WORLD_SCREEN_DURATION_MS = 2000` en `src/game/scenes/WorldScreen.js`; captura a los ~2.5 s del clic | Nivel visible | La captura muestra el nivel con Mario y el HUD | `.sdd/evidence/002-nivel.png`, `.sdd/evidence/002-nivel-teclado.png` | La espera se verificó de forma cualitativa por captura, no cronometrada al milisegundo |
| Al iniciar el nivel, Small Mario aparece en el punto de inicio y el estado es 3 vidas, 0 monedas y 0 puntos | Inspección de la captura del nivel | Mario visible y HUD con valores iniciales | `MARIO 000000`, `COINS 00`, `LIVES 03`, `WORLD 1-1`; Small Mario sobre el suelo en el extremo izquierdo | `.sdd/evidence/002-nivel.png` | HUD mínimo temporal; la spec 013 lo reemplaza |
| Durante la World Screen no se puede reiniciar la transición ni volver al menú | Enter y clic durante la espera, captura 300 ms después | La World Screen no cambia | La captura sigue mostrando `WORLD 1-1`; el input de la escena está deshabilitado y no hay handlers de navegación | `.sdd/evidence/002-world-sin-cambio.png` | Se probaron Enter y clic; no otras teclas |
| `npm run build` termina sin errores | `npm run build` | Exit 0 | `build exit: 0`; única advertencia: chunk > 500 kB (Phaser) | Salida de `npm run build` | La advertencia es preexistente de la plantilla |

## Result and follow-up

Resultado: spec 002 implementada y verificada. El arranque es `Boot → MainMenu → WorldScreen → Game`; `Boot` carga las hojas y crea el `GameState` inicial en el registry.

Decisiones tomadas en revisión:
- Título `SUPER MARIO BROS` con subtítulo `Versión simplificada`.
- World Screen de solo texto sobre fondo plano, con 2000 ms de espera.
- HUD mínimo temporal de texto (`MARIO`, `COINS`, `LIVES`, `WORLD`); la spec 013 lo reemplaza.
- Nivel esqueleto con suelo provisional y escala de Mario ×2 hasta que la spec 012 defina el nivel.

Limitaciones:
- No hubo playtest manual humano; la verificación se hizo con Chrome headless y CDP.
- El nivel esqueleto no tiene movimiento, cámara ni contenido de World 1-1: es alcance de 003 y 012.
- La tecla Espacio comparte el handler con Enter, pero no se ejercitó de forma automatizada.

Seguimiento:
- La spec 012 debe reemplazar el suelo provisional y fijar la escala definitiva del nivel.
- La spec 013 debe reemplazar el HUD de texto por el HUD con dígitos del GDD §9.
- `GameState` hoy es de solo lectura; las specs 013 y 015 agregan mutaciones de puntaje, monedas y vidas.
