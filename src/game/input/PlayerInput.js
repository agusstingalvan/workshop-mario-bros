import { Input } from 'phaser';

// Las teclas se traducen a intenciones; el jugador decide cuándo ejecutarlas.
export class PlayerInput {
    #keys;
    #jumpAt = -Infinity;

    constructor(scene) {
        this.#keys = scene.input.keyboard.addKeys('LEFT,RIGHT,UP,A,D,W,SPACE');
        scene.input.keyboard.addCapture(['SPACE', 'UP', 'LEFT', 'RIGHT']);
    }

    sample(time) {
        const keys = this.#keys;
        const jump = ['SPACE', 'UP', 'W'].some(key => Input.Keyboard.JustDown(keys[key]));
        if (jump) this.#jumpAt = time;
        return {
            axis: Number(keys.RIGHT.isDown || keys.D.isDown) - Number(keys.LEFT.isDown || keys.A.isDown),
            jumpAt: this.#jumpAt
        };
    }

    consumeJump() { this.#jumpAt = -Infinity; }
}
