import { Scene } from 'phaser';
import { label, button, digits } from '../ui/widgets';

export class End extends Scene {
    constructor() { super('End'); }

    create({ won = false } = {}) {
        this.cameras.main.setBackgroundColor('#173c46');
        label(this, 512, 170, won ? 'WORLD 1-1 / COMPLETADO' : 'FIN DE LA PARTIDA', 18, '#ffd36b').setOrigin(0.5);
        label(this, 512, 260, won ? '¡Nivel completado!' : 'GAME OVER', 48).setOrigin(0.5);
        label(this, 512, 325, won ? 'Cada salto te trajo hasta aquí.' : 'Una aventura más. Un salto mejor.', 19, '#a9c9c5').setOrigin(0.5);
        this.add.image(512, 414, 'characters', won ? 1 : 0).setScale(4);
        const { score, coins } = this.registry.get('session').snapshot;
        label(this, 345, 480, 'SCORE', 15, '#a9c9c5').setOrigin(0.5);
        label(this, 660, 480, 'COINS', 15, '#a9c9c5').setOrigin(0.5);
        digits(this, 285, 520, score, 6);
        digits(this, 648, 520, coins);
        button(this, 512, 625, 'VOLVER AL MENÚ', () => this.scene.start('Menu'));
        label(this, 512, 684, 'ENTER PARA VOLVER', 13, '#a9c9c5').setOrigin(0.5);
        const back = () => this.scene.start('Menu');
        this.input.keyboard.once('keydown-ENTER', back);
        this.events.once('shutdown', () => this.input.keyboard.off('keydown-ENTER', back));
    }
}
