import { Input, Scene } from 'phaser';
import { TILES, TILE_SEQUENCES } from '../constants/assets.js';
import { Mario } from '../entities/Mario.js';
import { GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const GROUND_COLOR = 0x8b5a2b;
const GROUND_TOP = 700;
const GROUND_HEIGHT = 18;
const PLATFORM_TOP = 540;
const PLATFORM_LEFT = 860;
const PLATFORM_TILES = 4;
const WALL_X = 709;
const WALL_ROWS = 3;
const BLOCK_X = 650;
const PIPE_X = 600;
const MARIO_START = Object.freeze({ x: 896, y: 480 });
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 768;
const HUD_MARGIN = 24;

/**
 * Nivel esqueleto de la spec 003. Incluye un escenario de prueba con suelo,
 * plataforma, bloque, tubería y pared para verificar movimiento y colisiones.
 * El nivel real de World 1-1 corresponde a la spec 012.
 */
export class Game extends Scene
{
    #solids;
    #mario;
    #cursors;
    #keys;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.#createScaffold();

        this.#mario = new Mario(this, MARIO_START.x, MARIO_START.y);
        this.physics.add.collider(this.#mario, this.#solids);

        this.#cursors = this.input.keyboard.createCursorKeys();
        this.#keys = this.input.keyboard.addKeys({ left: 'A', right: 'D', jump: 'W' });

        this.#createHud(state);
    }

    update (time, delta)
    {
        const jumpPressed = Input.Keyboard.JustDown(this.#cursors.space)
            || Input.Keyboard.JustDown(this.#cursors.up)
            || Input.Keyboard.JustDown(this.#keys.jump);

        this.#mario.update({
            left: this.#cursors.left.isDown || this.#keys.left.isDown,
            right: this.#cursors.right.isDown || this.#keys.right.isDown,
            jumpPressed
        }, delta);
    }

    #createScaffold ()
    {
        this.#solids = this.physics.add.staticGroup();

        const ground = this.add.rectangle(
            WORLD_WIDTH / 2,
            GROUND_TOP + GROUND_HEIGHT / 2,
            WORLD_WIDTH,
            GROUND_HEIGHT,
            GROUND_COLOR
        );

        this.#solids.add(ground);

        TILE_SEQUENCES.WOOD_PLATFORM.slice(0, PLATFORM_TILES).forEach((tile, index) =>
        {
            this.#addTile(
                tile,
                PLATFORM_LEFT + tile.rect.width / 2 + index * tile.rect.width,
                PLATFORM_TOP + tile.rect.height / 2
            );
        });

        for (let row = 0; row < WALL_ROWS; row++)
        {
            this.#addTile(TILES.HARD_BLOCK, WALL_X, GROUND_TOP - 9 - row * 18);
        }

        this.#addTile(TILES.HARD_BLOCK, BLOCK_X, GROUND_TOP - 9);
        this.#addTile(TILES.PIPE_BODY, PIPE_X, GROUND_TOP - 9);
        this.#addTile(TILES.PIPE_TOP, PIPE_X, GROUND_TOP - 27);
    }

    #addTile (tile, x, y)
    {
        this.#solids.create(x, y, tile.texture, tile.frame);
    }

    #createHud (state)
    {
        const hud = [
            `MARIO ${String(state.score).padStart(6, '0')}`,
            `COINS ${String(state.coins).padStart(2, '0')}`,
            `LIVES ${String(state.lives).padStart(2, '0')}`,
            `WORLD ${state.world}`
        ].join('   ');

        this.add.text(HUD_MARGIN, HUD_MARGIN, hud, {
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#ffffff'
        }).setScrollFactor(0);
    }
}
