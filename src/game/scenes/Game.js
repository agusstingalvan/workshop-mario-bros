import { Input, Scene } from 'phaser';
import { TILES, TILE_SEQUENCES } from '../constants/assets.js';
import { Mario, MARIO_DAMAGED_EVENT } from '../entities/Mario.js';
import { GAME_OVER_EVENT, GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const GROUND_COLOR = 0x8b5a2b;
const GROUND_TOP = 700;
const GROUND_HEIGHT = 18;
const PIT_LEFT = 300;
const PIT_RIGHT = 360;
const PIT_KILL_Y = 720;
const PLATFORM_TOP = 540;
const PLATFORM_LEFT = 860;
const PLATFORM_TILES = 4;
const MUSHROOM_X = 868;
const HAZARD_X = 925;
const MARIO_START = Object.freeze({ x: 896, y: 480 });
const WORLD_WIDTH = 1024;
const WORLD_HEIGHT = 768;
const HUD_MARGIN = 24;

/**
 * Escenario esqueleto de la spec 005. Incluye plataforma, hongo y peligro de
 * prueba, y un pozo. El hongo y el peligro son andamiaje: los reemplazan 008,
 * 009 y 010; el suelo y el pozo los define 011/012.
 */
export class Game extends Scene
{
    #solids;
    #mario;
    #cursors;
    #keys;
    #hudText;
    #handlingDeath = false;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        this.#handlingDeath = false;
        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        this.#createScaffold();

        this.#mario = new Mario(this, MARIO_START.x, MARIO_START.y);
        this.#mario.on(MARIO_DAMAGED_EVENT, (payload) => this.#handleMarioDamaged(payload));

        this.physics.add.collider(this.#mario, this.#solids);
        this.#createTestObjects();

        this.#cursors = this.input.keyboard.createCursorKeys();
        this.#keys = this.input.keyboard.addKeys({ left: 'A', right: 'D', jump: 'W' });

        this.#createHud(state);
    }

    update (time, delta)
    {
        if (this.#handlingDeath)
        {
            return;
        }

        if (this.#mario.y > PIT_KILL_Y)
        {
            this.#mario.die();
            return;
        }

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

        this.#addGround(0, PIT_LEFT);
        this.#addGround(PIT_RIGHT, WORLD_WIDTH);

        TILE_SEQUENCES.WOOD_PLATFORM.slice(0, PLATFORM_TILES).forEach((tile, index) =>
        {
            this.#solids.create(
                PLATFORM_LEFT + tile.rect.width / 2 + index * tile.rect.width,
                PLATFORM_TOP + tile.rect.height / 2,
                tile.texture,
                tile.frame
            );
        });
    }

    #addGround (from, to)
    {
        const width = to - from;

        this.#solids.add(this.add.rectangle(
            from + width / 2,
            GROUND_TOP + GROUND_HEIGHT / 2,
            width,
            GROUND_HEIGHT,
            GROUND_COLOR
        ));
    }

    #createTestObjects ()
    {
        const mushroom = TILES.SUPER_MUSHROOM;

        const pickup = this.physics.add.staticImage(MUSHROOM_X, PLATFORM_TOP, mushroom.texture, mushroom.frame)
            .setOrigin(0.5, 1)
            .refreshBody();

        this.physics.add.overlap(this.#mario, pickup, () =>
        {
            pickup.destroy();
            this.#mario.grow();
        });

        const hazard = this.add.rectangle(HAZARD_X, PLATFORM_TOP - 9, 18, 18, 0xff3b30);

        this.physics.add.existing(hazard, true);
        this.physics.add.overlap(this.#mario, hazard, () => this.#mario.takeDamage());
    }

    #handleMarioDamaged ({ fatal })
    {
        if (!fatal || this.#handlingDeath)
        {
            return;
        }

        this.#handlingDeath = true;

        const state = this.registry.get(GAME_STATE_KEY);
        const lives = state.loseLife();

        this.#updateHud(state);
        console.info(`[game] vida perdida · vidas restantes: ${lives}`);

        if (lives <= 0)
        {
            console.info('[game] game over');
            this.game.events.emit(GAME_OVER_EVENT);
            this.scene.pause();
            return;
        }

        this.scene.restart();
    }

    #createHud (state)
    {
        this.#hudText = this.add.text(HUD_MARGIN, HUD_MARGIN, this.#formatHud(state), {
            fontFamily: 'monospace',
            fontSize: 20,
            color: '#ffffff'
        }).setScrollFactor(0);
    }

    #updateHud (state)
    {
        this.#hudText.setText(this.#formatHud(state));
    }

    #formatHud (state)
    {
        return [
            `MARIO ${String(state.score).padStart(6, '0')}`,
            `COINS ${String(state.coins).padStart(2, '0')}`,
            `LIVES ${String(state.lives).padStart(2, '0')}`,
            `WORLD ${state.world}`
        ].join('   ');
    }
}
