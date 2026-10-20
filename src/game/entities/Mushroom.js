import { RULES } from '../config';
import { Walker } from './Walker';

export class Mushroom {
    #walker = new Walker(RULES.mushroomSpeed, 1);
    #state = 'emerging';

    constructor(scene, x, y) {
        this.sprite = scene.physics.add.sprite(x, y, 'tiles', 128).setDepth(4);
        this.sprite.setData('entity', this);
        this.sprite.body.enable = false;
        scene.tweens.add({
            targets: this.sprite, y: y - 18, duration: 450,
            onComplete: () => {
                if (!this.sprite.active) return;
                this.#state = 'walking';
                this.sprite.body.enable = true;
                this.sprite.body.reset(this.sprite.x, this.sprite.y);
            }
        });
    }

    touch(player) {
        if (this.#state !== 'walking') return;
        this.#state = 'collected';
        this.sprite.destroy();
        player.grow();
    }

    update() { if (this.#state === 'walking') this.#walker.update(this.sprite); }
}
