import { Scene } from 'phaser';
import tilesUrl from '../../../assets/tilemap_packed.png';
import charactersUrl from '../../../assets/tilemap-characters_packed.png';

export class Boot extends Scene {
    constructor() { super('Boot'); }

    preload() {
        this.load.spritesheet('tiles', tilesUrl, { frameWidth: 18, frameHeight: 18 });
        this.load.spritesheet('characters', charactersUrl, { frameWidth: 24, frameHeight: 24 });
    }

    create() {
        this.anims.create({ key: 'mario_walk', frames: this.anims.generateFrameNumbers('characters', { frames: [0, 1] }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'goomba_walk', frames: this.anims.generateFrameNumbers('characters', { frames: [11, 12] }), frameRate: 8, repeat: -1 });
        this.#plantTexture('piranha_open', 4);
        this.#plantTexture('piranha_closed', 2);
        this.anims.create({ key: 'piranha_bite', frames: [{ key: 'piranha_open' }, { key: 'piranha_closed' }], frameRate: 4, repeat: -1 });
        this.scene.start('Menu');
    }

    #plantTexture(key, mouthHeight) {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x345551).fillRect(9, 14, 4, 20);
        graphics.fillStyle(0x2eb082).fillRect(8, 14, 4, 20);
        graphics.fillStyle(0x36e377).fillRect(0, 20, 6, 3).fillRect(14, 26, 6, 3);
        const widths = [6, 10, 12, 14, 14, 16, 16, 16, 16, 14, 14, 12, 10, 6];
        widths.forEach((width, y) => {
            graphics.fillStyle(0x7e3125).fillRect(10 - width / 2, y, width, 1);
            if (y > 0 && y < 13) graphics.fillStyle(0xdd442c).fillRect(11 - width / 2, y, width - 2, 1);
        });
        graphics.fillStyle(0xffffff).fillRect(4, 4, 2, 2).fillRect(14, 4, 2, 2).fillRect(5, 8, 10, mouthHeight);
        if (mouthHeight === 4) {
            graphics.fillStyle(0xdd442c);
            for (const x of [6, 10, 14]) graphics.fillRect(x, 8, 2, 2);
            for (const x of [8, 12]) graphics.fillRect(x, 10, 2, 2);
        }
        graphics.generateTexture(key, 20, 34);
        graphics.destroy();
    }
}
