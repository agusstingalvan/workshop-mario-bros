export class Piranha {
    #scene;
    #state = 'hidden';
    #nextAt;
    #baseY;

    constructor(scene, x, pipeTop, delay = 0) {
        this.#scene = scene;
        this.#baseY = pipeTop + 34;
        this.#nextAt = scene.time.now + 2000 + delay;
        this.sprite = scene.physics.add.sprite(x, this.#baseY, 'piranha_closed')
            .setOrigin(0.5, 1).setDepth(9);
        this.sprite.body.setAllowGravity(false).setImmovable(true).setSize(12, 10).setOffset(4, 2);
        this.sprite.setData('entity', this);
    }

    touch(player) {
        if (this.#state !== 'hidden' && this.sprite.body.top < this.#baseY - 34) {
            player.hurt(this.#scene.time.now);
        }
    }

    update(time) {
        if (time < this.#nextAt) return;
        if (this.#state === 'hidden') {
            this.#state = 'rising';
            this.#nextAt = Infinity;
            this.#move(this.#baseY - 26, 'Sine.easeOut', 'outside');
        } else if (this.#state === 'outside') {
            this.#state = 'lowering';
            this.#nextAt = Infinity;
            this.#move(this.#baseY, 'Sine.easeIn', 'hidden');
        }
    }

    #move(y, ease, next) {
        this.sprite.play('piranha_bite', true);
        this.#scene.tweens.add({
            targets: this.sprite, y, duration: 1200, ease,
            onComplete: () => {
                this.#state = next;
                this.#nextAt = this.#scene.time.now + 2000;
                if (next === 'hidden') this.sprite.anims.stop();
            }
        });
    }
}
