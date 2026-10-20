// Polimorfismo: cada bloque conoce su respuesta al golpe; la escena solo coordina.
class Block {
    #scene;
    #lastHit = -Infinity;

    constructor(scene, group, x, y, frame) {
        this.#scene = scene;
        this.sprite = group.create(x, y, 'tiles', frame).setDepth(8).setData('entity', this);
    }

    hit(player) {
        if (this.#scene.time.now - this.#lastHit < 250) return;
        this.#lastHit = this.#scene.time.now;
        this.respond(player);
    }

    bump() {
        this.#scene.tweens.add({ targets: this.sprite, y: this.sprite.y - 4, duration: 90, yoyo: true });
    }

    respond() { this.bump(); }
}

export class HardBlock extends Block {
    constructor(scene, group, x, y) { super(scene, group, x, y, 11); }
}

export class BrickBlock extends Block {
    #scene;

    constructor(scene, group, x, y) {
        super(scene, group, x, y, 29);
        this.#scene = scene;
    }

    respond(player) {
        if (!player.isSuper) return this.bump();
        const { x, y } = this.sprite;
        this.sprite.destroy();
        for (const direction of [-1, 1]) {
            const shard = this.#scene.add.image(x, y, 'tiles', 29).setScale(1).setDepth(15);
            this.#scene.tweens.add({
                targets: shard, x: x + direction * 28, y: y - 35, alpha: 0, angle: direction * 120,
                duration: 420, onComplete: () => shard.destroy()
            });
        }
    }
}

export class QuestionBlock extends Block {
    #scene;
    #state = 'full';

    constructor(scene, group, x, y) {
        super(scene, group, x, y, 10);
        this.#scene = scene;
    }

    respond() {
        if (this.#state === 'empty') return;
        this.#state = 'empty';
        this.sprite.setFrame(9);
        this.bump();
        this.#scene.spawnMushroom(this.sprite.x, this.sprite.y);
    }
}
