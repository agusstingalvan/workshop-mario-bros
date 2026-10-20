import { TILES } from '../../constants/assets.js';
import { Block } from './Block.js';

export class HardBlock extends Block
{
    constructor (scene, x, y)
    {
        super(scene, x, y, TILES.HARD_BLOCK);
    }

    hit ()
    {
        console.info('[block] hard hit');
        this.bounce();
    }
}
