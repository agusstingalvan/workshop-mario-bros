# Verificación del juego

## Comandos

- `npm ci`: dependencias instaladas desde el lockfile existente, sin agregar paquetes.
- `npm run build`: build de producción aprobado. Vite advierte sobre el tamaño del chunk de Phaser.
- `npm audit`: informa seis vulnerabilidades altas en dependencias existentes del entorno de build. No se aplicaron actualizaciones automáticas.

## Navegador

Se abrió el juego con Chromium mediante `agent-browser` y se revisaron capturas del menú, World 1-1 y Game Over. Sin errores JavaScript registrados durante esa revisión.

El script `tests/browser-playtest.js` completó **27 comprobaciones aprobadas** de integración en Phaser real: navegación de pantallas, controles, salto, aterrizaje, monedas, bloques, emergencia y recolección del hongo, transformación, hitboxes, daño, invulnerabilidad, pisotón, plantas ocultas y expuestas, pozos, reinicios, Game Over, nueva partida y meta. Las posiciones se controlan para aislar cada interacción.

Para repetirlo, iniciar `npm run dev-nolog` y ejecutar en la consola del navegador:

```js
await (await import('/tests/browser-playtest.js')).runPlaytest()
```

## Revisión humana pendiente

- Recorrer World 1-1 completo, sin reposicionar personajes, y ajustar dificultad si es necesario.
- Comprobar la sensación de input buffer y coyote time en los bordes de plataformas.
- Probar en otros navegadores y tamaños de ventana. Los controles requieren teclado; no se implementaron controles táctiles (no forman parte del GDD).
