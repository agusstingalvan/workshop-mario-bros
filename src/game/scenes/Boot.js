import { Scene } from 'phaser';
import { TEXTURES } from '../constants/assets.js';
import { GAME_STATE_KEY, GameState } from '../state/GameState.js';

/**
 * Primera escena: carga las hojas una sola vez, inicializa la partida y cede
 * el control al menú. No tiene contenido visible.
 */
export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.setPath('assets');

        Object.values(TEXTURES).forEach((sheet) =>
        {
            this.load.spritesheet(sheet.key, sheet.file, {
                frameWidth: sheet.frameWidth,
                frameHeight: sheet.frameHeight
            });
        });
    }

    create ()
    {
        this.registry.set(GAME_STATE_KEY, new GameState());
        this.scene.start('MainMenu');
    }
}
