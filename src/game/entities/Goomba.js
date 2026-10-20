import { RULES } from '../config';
import { Walker } from './Walker';

export class Goomba {
    #scene;
    #state = 'walking';
    #walker = new Walker(RULES.enemySpeed);

    constructor(scene, x, y) {
        this.#scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'characters', 11).setOrigin(0.5, 1).setDepth(11);
        this.sprite.body.setSize(16, 14).setOffset(4, 10);
        this.sprite.setData('entity', this).play('goomba_walk');
    }

    touch(player) {
        if (this.#state !== 'walking') return;
        const body = player.sprite.body;
        const previousBottom = body.prev.y + body.height;
        if (body.velocity.y > 0 && previousBottom <= this.sprite.body.top + 6) {
            this.#state = 'squashed';
            this.sprite.disableBody().anims.stop();
            this.sprite.setFrame(11).setScale(1, 0.3);
            this.#scene.time.delayedCall(100, () => this.sprite.destroy());
            player.bounce();
        } else player.hurt(this.#scene.time.now);
    }

    update() { if (this.#state === 'walking') this.#walker.update(this.sprite); }
}
