import { TILES } from '../../constants/assets.js';
import { Block } from './Block.js';

export class BrickBlock extends Block
{
    constructor (scene, x, y)
    {
        super(scene, x, y, TILES.BRICK_BLOCK);
    }

    hit (mario)
    {
        if (mario.isSuper)
        {
            console.info('[block] brick broken');
            this.destroy();
            return;
        }

        console.info('[block] brick bounce');
        this.bounce();
    }
}
