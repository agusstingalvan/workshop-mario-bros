import { BrickBlock } from './BrickBlock.js';
import { EmptyBlock } from './EmptyBlock.js';
import { HardBlock } from './HardBlock.js';
import { QuestionBlock } from './QuestionBlock.js';

export const BLOCK_TYPES = Object.freeze({
    HARD: 'hard',
    BRICK: 'brick',
    QUESTION: 'question',
    EMPTY: 'empty'
});

const BUILDERS = Object.freeze({
    [BLOCK_TYPES.HARD]: (scene, x, y) => new HardBlock(scene, x, y),
    [BLOCK_TYPES.BRICK]: (scene, x, y) => new BrickBlock(scene, x, y),
    [BLOCK_TYPES.QUESTION]: (scene, x, y, options) => new QuestionBlock(scene, x, y, options.onRelease),
    [BLOCK_TYPES.EMPTY]: (scene, x, y) => new EmptyBlock(scene, x, y)
});

export const createBlock = (scene, type, x, y, options = {}) =>
{
    const build = BUILDERS[type];

    if (!build)
    {
        throw new Error(`Tipo de bloque desconocido: ${type}`);
    }

    return build(scene, x, y, options);
};
