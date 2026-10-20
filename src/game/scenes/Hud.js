import { Scene } from 'phaser';
import { label, digits } from '../ui/widgets';

export class Hud extends Scene {
    #numbers = [];

    constructor() { super('Hud'); }

    create() {
        this.#numbers = [];
        this.add.rectangle(512, 44, 1024, 88, 0x173c46, 0.96);
        this.add.rectangle(512, 89, 1024, 2, 0xffd36b);
        for (const [x, text] of [[44, 'MARIO / SCORE'], [370, 'COINS'], [580, 'LIVES'], [796, 'WORLD']]) {
            label(this, x, 16, text, 14, '#a9c9c5');
        }
        label(this, 796, 43, '1 - 1', 26);
        const session = this.registry.get('session');
        this.#render(session.snapshot);
        session.on('change', this.#render, this);
        const hint = label(this, 512, 726, '← → / A D  MOVER    ESPACIO / ↑ / W  SALTAR', 16, '#173c46').setOrigin(0.5);
        this.tweens.add({ targets: hint, alpha: 0, delay: 5000, duration: 600 });
        this.events.once('shutdown', () => session.off('change', this.#render, this));
    }

    #render({ score, coins, lives }) {
        this.#numbers.forEach(image => image.destroy());
        this.#numbers = [
            ...digits(this, 60, 61, score, 6),
            ...digits(this, 384, 61, coins),
            ...digits(this, 594, 61, lives)
        ];
    }
}
