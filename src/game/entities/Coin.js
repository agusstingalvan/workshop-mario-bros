import { Physics } from 'phaser';
import { TILES } from '../constants/assets.js';
import { COIN } from '../constants/coins.js';

export const COIN_COLLECTED_EVENT = 'coin:collected';

/**
 * Moneda estática con giro visual por scaleX. La hitbox de recolección queda
 * fija en 14 × 14 y la recolección está protegida contra doble conteo.
 */
export class Coin extends Physics.Arcade.Image
{
    #collected = false;

    constructor (scene, x, y)
    {
        const tile = TILES.COIN;

        super(scene, x, y, tile.texture, tile.frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.body.setSize(COIN.HITBOX, COIN.HITBOX, true);

        scene.tweens.add({
            targets: this,
            scaleX: { from: 1, to: COIN.MIN_SCALE_X },
            duration: COIN.SPIN_MS / 2,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        console.info(`[coin] hitbox ${this.body.width}×${this.body.height}`);
    }

    collect ()
    {
        if (this.#collected)
        {
            return false;
        }

        this.#collected = true;
        this.emit(COIN_COLLECTED_EVENT);
        this.destroy();

        return true;
    }
}
