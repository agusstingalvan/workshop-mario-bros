import { Scene } from 'phaser';
import { Session } from '../Session';
import { label, button } from '../ui/widgets';

export class Menu extends Scene {
    #starting = false;

    constructor() { super('Menu'); }

    create() {
        this.#starting = false;
        this.cameras.main.setBackgroundColor('#173c46');
        label(this, 48, 32, 'KENNEY / PIXEL PLATFORMER', 14, '#a9c9c5');
        label(this, 976, 32, 'UN JUGADOR  ·  01 NIVEL', 14, '#a9c9c5').setOrigin(1, 0);
        this.add.rectangle(512, 76, 928, 2, 0x42616a);
        label(this, 512, 112, 'UNA PEQUEÑA GRAN AVENTURA', 18, '#ffd36b').setOrigin(0.5);
        label(this, 512, 172, 'SUPER MARIO BROS', 64).setOrigin(0.5).setShadow(4, 5, '#092b33', 0);
        label(this, 512, 227, 'Salta. Explora. Llega a la bandera.', 19, '#a9c9c5').setOrigin(0.5);
        this.#diorama();
        button(this, 512, 622, 'JUGAR  →', () => this.#start());
        label(this, 512, 675, 'ENTER PARA COMENZAR', 13, '#a9c9c5').setOrigin(0.5);
        label(this, 512, 725, '← → / A D  MOVER     ·     ESPACIO / ↑ / W  SALTAR', 15).setOrigin(0.5);
        this.input.keyboard.on('keydown-ENTER', this.#start, this);
        this.events.once('shutdown', () => this.input.keyboard.off('keydown-ENTER', this.#start, this));
    }

    #start() {
        if (this.#starting) return;
        this.#starting = true;
        this.registry.get('session')?.destroy();
        this.registry.set('session', new Session());
        this.scene.start('World');
    }

    #diorama() {
        this.add.rectangle(512, 423, 832, 274, 0x092b33);
        this.add.rectangle(512, 415, 816, 258, 0x91d9e6);
        const mountains = this.add.graphics();
        mountains.fillStyle(0xbde9df).fillTriangle(105, 505, 300, 315, 495, 505)
            .fillTriangle(430, 505, 670, 335, 910, 505);
        mountains.fillStyle(0x83c9b1).fillTriangle(105, 505, 210, 420, 400, 505)
            .fillTriangle(500, 505, 750, 400, 920, 505);
        for (const x of [160, 520, 760]) {
            for (let i = 0; i < 4; i++) this.add.image(x + i * 18, 330 + (x % 3) * 12, 'tiles', 153 + i);
        }
        for (let col = 0; col < 23; col++) this.add.image(116 + col * 36, 524, 'tiles', 1).setScale(2);
        this.add.sprite(257, 506, 'characters', 0).setScale(3).setOrigin(0.5, 1).play('mario_walk');
        this.add.sprite(650, 506, 'characters', 11).setScale(2).setOrigin(0.5, 1).play('goomba_walk');
        [29, 10, 29].forEach((frame, i) => this.add.image(365 + i * 36, 408, 'tiles', frame).setScale(2));
        for (let i = 0; i < 3; i++) {
            const coin = this.add.image(365 + i * 36, 355, 'tiles', 151).setScale(2);
            this.tweens.add({ targets: coin, y: 349, duration: 700, yoyo: true, repeat: -1, delay: i * 120 });
        }
        this.add.image(805, 452, 'tiles', 95).setScale(4, 2);
        this.add.image(805, 488, 'tiles', 115).setScale(4, 2);
        label(this, 126, 300, 'WORLD 1-1', 13, '#173c46');
    }
}
