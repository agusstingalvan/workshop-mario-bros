import { TILES } from '../../constants/assets.js';
import { Block } from './Block.js';

export class EmptyBlock extends Block
{
    constructor (scene, x, y)
    {
        super(scene, x, y, TILES.EMPTY_BLOCK);
    }

    hit ()
    {
        console.info('[block] empty hit');
        this.bounce();
    }
}
