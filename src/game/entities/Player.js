import { PLAYER } from '../config';
import { PlayerInput } from '../input/PlayerInput';

export class Player {
    #scene;
    #input;
    #form = 'small';
    #motion = 'idle';
    #groundAt = -Infinity;
    #protectedUntil = 0;

    constructor(scene) {
        this.#scene = scene;
        this.#input = new PlayerInput(scene);
        this.sprite = scene.physics.add.sprite(PLAYER.startX, PLAYER.startY, 'characters', 0)
            .setOrigin(0.5, 1).setDepth(12);
        this.#applyForm();
    }

    get isSuper() { return this.#form === 'super'; }
    get isDead() { return this.#motion === 'dead'; }

    #applyForm() {
        const bodyWidth = this.isSuper ? 20 : 16;
        const bodyHeight = this.isSuper ? 26 : 22;
        const scale = this.isSuper ? 1.5 : 1;
        this.sprite.setScale(scale);
        // Arcade expresa el tamaño en unidades locales, antes de aplicar la escala.
        this.sprite.body.setSize(bodyWidth / scale, bodyHeight / scale);
        this.sprite.body.setOffset((24 - bodyWidth / scale) / 2, 24 - bodyHeight / scale);
    }

    grow() {
        if (this.isDead) return;
        this.#form = 'super';
        this.#applyForm();
        this.#scene.floatText(this.sprite.x, this.sprite.y - 32, 'SUPER!');
    }

    hurt(time) {
        if (this.isDead || time < this.#protectedUntil) return;
        if (!this.isSuper) {
            this.#scene.loseLife();
            return;
        }
        this.#form = 'small';
        this.#protectedUntil = time + PLAYER.invulnerabilityMs;
        this.#applyForm();
    }

    bounce() { this.sprite.setVelocityY(-PLAYER.bounce); }

    stop(dead = false) {
        this.#motion = dead ? 'dead' : 'finished';
        this.sprite.setVelocity(0).anims.stop();
        this.sprite.body.enable = false;
        this.sprite.setAlpha(1);
    }

    update(time) {
        if (this.#motion === 'dead' || this.#motion === 'finished') return;
        const sprite = this.sprite;
        const body = sprite.body;
        const intent = this.#input.sample(time);
        if (body.blocked.down) this.#groundAt = time;
        if (time - intent.jumpAt <= PLAYER.bufferMs && time - this.#groundAt <= PLAYER.coyoteMs) {
            sprite.setVelocityY(-PLAYER.jump);
            this.#groundAt = -Infinity;
            this.#input.consumeJump();
        }
        sprite.setVelocityX(intent.axis * PLAYER.speed);
        body.setGravityY(body.velocity.y > 0 ? PLAYER.fallGravity : 0);
        this.#motion = body.velocity.y < 0 ? 'jump' : !body.blocked.down ? 'fall' : intent.axis ? 'run' : 'idle';
        if (intent.axis) sprite.setFlipX(intent.axis < 0);
        if (this.#motion === 'run') sprite.play('mario_walk', true);
        else sprite.anims.stop().setFrame(this.#motion === 'idle' ? 0 : 1);
        sprite.setAlpha(time < this.#protectedUntil && Math.floor(time / 85) % 2 ? 0.35 : 1);
        if (sprite.x < 10) sprite.x = 10;
    }
}
