export const GAME_STATE_KEY = 'gameState';

export const INITIAL_STATE = Object.freeze({
    lives: 3,
    coins: 0,
    score: 0,
    world: '1-1'
});

/**
 * Estado de la partida. Vive en el registry de Phaser y se comparte entre
 * escenas sin variables globales. En la spec 002 solo se lee; las specs de
 * puntaje, vidas y reinicio le agregan mutaciones.
 */
export class GameState
{
    #lives;
    #coins;
    #score;
    #world;

    constructor (initial = INITIAL_STATE)
    {
        this.#lives = initial.lives;
        this.#coins = initial.coins;
        this.#score = initial.score;
        this.#world = initial.world;
    }

    get lives ()
    {
        return this.#lives;
    }

    get coins ()
    {
        return this.#coins;
    }

    get score ()
    {
        return this.#score;
    }

    get world ()
    {
        return this.#world;
    }
}
