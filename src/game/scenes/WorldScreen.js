import { Scene } from 'phaser';

const WORLD_LABEL = 'WORLD 1-1';
const WORLD_SCREEN_DURATION_MS = 2000;

export class WorldScreen extends Scene
{
    constructor ()
    {
        super('WorldScreen');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x000000);
        this.input.enabled = false;

        this.add.text(512, 384, WORLD_LABEL, {
            fontFamily: 'monospace',
            fontSize: 72,
            fontStyle: 'bold',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.time.delayedCall(WORLD_SCREEN_DURATION_MS, () => this.scene.start('Game'));
    }
}
