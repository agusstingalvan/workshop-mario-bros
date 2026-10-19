import { Scene } from 'phaser';
import { CHARACTERS } from '../constants/assets.js';
import { GAME_STATE_KEY } from '../state/GameState.js';

const SKY_COLOR = 0x5c94fc;
const GROUND_COLOR = 0x8b5a2b;
const GROUND_Y = 700;
const GROUND_HEIGHT = 16;
const LEVEL_SCALE = 2;
const START_POINT = Object.freeze({ x: 120, y: GROUND_Y - GROUND_HEIGHT / 2 });
const HUD_MARGIN = 24;

/**
 * Nivel esqueleto de la spec 002: solo valida la llegada desde World Screen,
 * el punto de inicio de Mario y el estado inicial visible. El nivel real
 * (suelo, cámara, bloques y enemigos) corresponde a la spec 012.
 */
export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const state = this.registry.get(GAME_STATE_KEY);

        this.cameras.main.setBackgroundColor(SKY_COLOR);
        this.add.rectangle(512, GROUND_Y, 1024, GROUND_HEIGHT, GROUND_COLOR);

        const mario = CHARACTERS.SMALL_MARIO;

        this.add.image(START_POINT.x, START_POINT.y, mario.texture, mario.frames[0])
            .setOrigin(mario.origin.x, mario.origin.y)
            .setScale(LEVEL_SCALE);

        this.#createHud(state);
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
