import { Physics } from 'phaser';
import { BLOCK_TUNING } from '../../constants/blocks.js';

/**
 * Bloque sólido base. El rebote mueve la imagen y sincroniza el body estático
 * para que la colisión acompañe el desplazamiento de 4 px.
 */
export class Block extends Physics.Arcade.Image
{
    #homeY;
    #bouncing = false;

    constructor (scene, x, y, tile)
    {
        super(scene, x, y, tile.texture, tile.frame);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.#homeY = y;
    }

    /** Golpe desde abajo. Las variantes deciden si además rompen o entregan. */
    hit ()
    {
        this.bounce();
    }

    bounce ()
    {
        if (this.#bouncing)
        {
            return;
        }

        this.#bouncing = true;

        this.scene.tweens.add({
            targets: this,
            y: this.#homeY - BLOCK_TUNING.BOUNCE_DISTANCE,
            duration: BLOCK_TUNING.BOUNCE_DURATION_MS,
            yoyo: true,
            onUpdate: () => this.body.updateFromGameObject(),
            onComplete: () =>
            {
                this.y = this.#homeY;
                this.body.updateFromGameObject();
                this.#bouncing = false;
            }
        });
    }
}
