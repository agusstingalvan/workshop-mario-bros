import { Scene } from 'phaser';
import { label, digits } from '../ui/widgets';

export class World extends Scene {
    constructor() { super('World'); }

    create() {
        this.cameras.main.setBackgroundColor('#173c46');
        label(this, 512, 250, 'PREPÁRATE', 17, '#ffd36b').setOrigin(0.5);
        label(this, 512, 320, 'WORLD 1-1', 48).setOrigin(0.5);
        this.add.image(468, 412, 'characters', 0).setScale(3);
        label(this, 512, 412, '×', 28).setOrigin(0.5);
        digits(this, 565, 412, this.registry.get('session').snapshot.lives, 1, 3, true);
        label(this, 512, 525, 'La aventura empieza aquí.', 18, '#a9c9c5').setOrigin(0.5);
        this.time.delayedCall(1800, () => this.scene.start('Game'));
    }
}
