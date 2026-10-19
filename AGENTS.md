# Agent Instructions

## Acuerdo de trabajo

- Inspeccionar el repositorio antes de proponer cambios. Nombrar archivos relevantes, convenciones y comandos de verificación.
- Mantener los cambios pequeños y dentro del alcance aprobado. Pedir aprobación explícita en la conversación antes de borrar o migrar datos, publicar, instalar dependencias, cambiar configuración de entrega, acceder a secretos o usar operaciones Git destructivas.
- Tratar planes, pruebas, builds, capturas y revisión humana como evidencia. No afirmar que un cambio funciona sin nombrar la evidencia.
- Preservar las convenciones existentes del proyecto. No reemplazar la configuración solo para facilitar una tarea.
- Detenerse y explicar cuando los requisitos, criterios de aceptación o verificación sean ambiguos.

## Reporte de cierre

Informar archivos modificados, verificación realizada, evidencia obtenida, limitaciones y decisiones pendientes para revisión humana.

## Stack tecnológico actual

| Área | Tecnología | Notas |
|---|---|---|
| Motor | Phaser 4.0.0 | Escenas, spritesheets, tweens, grupos y físicas Arcade |
| Lenguaje | JavaScript moderno (ES Modules) | Sin TypeScript |
| Build y desarrollo | Vite 6.3.1 | Configs en `vite/config.dev.mjs` y `vite/config.prod.mjs` |
| Minificación | Terser | Solo para builds de producción |
| Runtime | Node.js + npm | Requerido para instalar dependencias y ejecutar scripts |
| Estilos | CSS | `public/style.css` |
| Assets | Kenney Pixel Platformer (CC0) | Spritesheets fuente en `assets/`, servidos desde `public/assets/` |
| Diseño | `docs/GDD.md` | Fuente de verdad del gameplay |
| Proceso | `.sdd/` | Specs, planes y evidencia |
| Tests y lint | No configurados | La verificación actual es build + playtest manual |

### Estructura del proyecto

- `index.html`: contenedor `#game-container` donde se monta el juego.
- `src/main.js`: bootstrap de la aplicación al cargar el DOM.
- `src/game/main.js`: configuración de Phaser (1024 × 768, `Scale.FIT`, `Scale.CENTER_BOTH`) y arranque.
- `src/game/scenes/`: escenas del juego; actualmente solo `Game.js`.
- `public/assets/`: assets estáticos servidos en runtime.
- `assets/`: spritesheets fuente del juego.
- `docs/GDD.md`: diseño del juego, assets, reglas y alcance.
- `.sdd/`: specs, planes, evidencia y templates.

Estado actual: plantilla base de Phaser. El alcance jugable (Mario, bloques, enemigos, HUD y pantallas) está especificado en el GDD y todavía no está implementado. No asumir que existe código que no esté en `src/`.

### Comandos

| Comando | Uso |
|---|---|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor de desarrollo en `http://localhost:8080` |
| `npm run dev-nolog` | Igual que `dev`, sin telemetría de la plantilla |
| `npm run build` | Build de producción en `dist/` |
| `npm run build-nolog` | Build de producción sin telemetría de la plantilla |

## Metodología de trabajo SDD

Todo cambio de comportamiento sigue este flujo:

1. **Spec** (`sdd-spec`): definir problema y valor, comportamiento actual y esperado, referencia al GDD, alcance, no-alcance, restricciones, criterios de aceptación, evidencia esperada y preguntas abiertas. Copiar `.sdd/templates/spec.md` a `.sdd/specs/NNN-slug.md`. No escribir código todavía.
2. **Aprobación humana**: la spec solo está aprobada cuando `Human approval` indica `approved`, con responsable y fecha. Sin aprobación no se crea el plan ni se implementa.
3. **Plan** (`sdd-plan`): copiar `.sdd/templates/plan.md` a `.sdd/plans/NNN-slug.md`, vincular la spec aprobada, inspeccionar el repositorio y listar archivos, símbolos, pasos, verificación y condiciones de freno. No implementar durante el plan.
4. **Implementación**: respetar el plan. Cualquier cambio de alcance exige volver a la spec.
5. **Verificación** (`verify`): elegir la verificación más pequeña que cubra los criterios. Usar `npm run build` y playtest manual; no inventar resultados.
6. **Evidencia**: copiar `.sdd/templates/evidence.md` a `.sdd/evidence/NNN-slug.md` con la tabla criterio → verificación → resultado, limitaciones y seguimiento.

Reglas:

- Usar el mismo identificador `NNN-slug` en spec, plan y evidencia, y enlazarlos entre sí.
- Mantener specs, planes y evidencia junto al código; se revisan juntos.
- No editar los templates para un cambio puntual.
- Un cambio revisable = una spec.
- Los cambios triviales sin impacto en comportamiento (typos, documentación) pueden omitir el ciclo; cualquier cambio de comportamiento requiere spec.
- Si el GDD y el pedido difieren, detenerse y resolver la ambigüedad antes de codificar.
- Skills locales disponibles: `.opencode/skills/sdd-spec`, `.opencode/skills/sdd-plan` y `.opencode/skills/verify`.

## Buenas prácticas de POO

- Usar clases ES para entidades con estado y comportamiento propio; usar funciones puras para cálculos sin estado.
- Una responsabilidad por clase. Las escenas coordinan; no concentran toda la lógica del juego.
- Encapsular: mantener el estado interno privado (`#campo` o closure) y exponer una API pública mínima. No mutar entidades desde otras clases.
- Preferir composición sobre herencia. Heredar de `Phaser.Scene` o de una base propia solo cuando la relación sea real; evitar jerarquías profundas.
- Inyectar dependencias (escena, registry, configuración, datos del nivel) por constructor o parámetros. Evitar estado global y singletons ocultos.
- Usar polimorfismo para variantes (enemigo, bloque, item) en lugar de condicionales por `type`.
- Modelar máquinas de estado explícitas para Mario (small/super, idle/run/jump/fall/hurt/dead), Goomba, Piranha Plant y bloques; no acumular booleanos contradictorios.
- Separar las reglas de dominio (puntaje, daño, estados) de la presentación y la física de Phaser.
- Nombres: `PascalCase` para clases, `camelCase` para métodos y propiedades, `UPPER_SNAKE_CASE` para constantes, y un archivo por clase con el nombre de la clase. Identificadores en inglés; documentación y comentarios en español.
- Sin números mágicos: centralizar el tuning (velocidad, gravedad, saltos, puntajes, tiempos) en constantes o configuración.
- Evitar clases "Dios", archivos largos y duplicación de física, animaciones o carga de assets.
- No sobre-ingeniería: aplicar una abstracción solo cuando resuelva un problema concreto.

## Patrones de diseño para videojuegos

| Patrón | Dónde usarlo | Implementación sugerida |
|---|---|---|
| State | Estados de Mario, enemigos, bloques y pantallas | Clases de estado o máquina de estados con transiciones explícitas |
| Component / Entity | Mario, enemigos, items y bloques | Composición de comportamiento sobre `Phaser.GameObjects` y grupos |
| Factory | Crear enemigos, items y bloques desde los datos del nivel | Factory por tipo con registro de constructores |
| Observer | HUD, puntaje, vidas y eventos de nivel | `scene.events` y `registry.events`; evitar acoplar el HUD a las entidades |
| Command | Input de movimiento y salto, input buffer y coyote time | Mapear teclas a comandos y guardar un historial corto de intenciones |
| Strategy | Movimiento o patrulla de enemigos, salto y reglas de daño | Estrategias intercambiables por composición |
| Object Pool | Monedas, partículas y objetos frecuentes | `Phaser.GameObjects.Group` con `maxSize` y reutilización |
| Template Method | Ciclo `preload`/`create`/`update` de las escenas | Clase base de escena con hooks; no duplicar el bootstrap |
| Flyweight | Texturas, frames y animaciones compartidas | Cargar spritesheets una vez y reutilizar animaciones globales |
| Singleton (con moderación) | Configuración de partida y registro del nivel | `scene.registry` o un módulo de configuración; evitar variables globales |
| Facade | Input, audio y carga de nivel | Envolver APIs de Phaser cuando la complejidad lo justifique |

Reglas:

- Elegir el patrón más simple que resuelva el problema y documentarlo en el plan.
- No crear un framework interno ni abstracciones prematuras.
- Los patrones deben reducir acoplamiento y facilitar el playtest, no ocultar el flujo.

## Fuente de verdad y verificación

- `docs/GDD.md` manda en gameplay; `AGENTS.md` manda en ingeniería. Ante conflicto, preguntar antes de avanzar.
- Usar los frames, rects y hitboxes documentados en el GDD §2; no inventar frames.
- Antes de cerrar un cambio: ejecutar `npm run build` y hacer playtest manual de los criterios de aceptación. Registrar el resultado real; si algo no se puede verificar, declararlo explícitamente.
