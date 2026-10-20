import { Events } from 'phaser';
import { RULES } from './config';

// Observer: el HUD escucha cambios, sin conocer al jugador ni a las monedas.
export class Session extends Events.EventEmitter {
    #score = 0;
    #coins = 0;
    #lives = RULES.lives;

    get snapshot() { return { score: this.#score, coins: this.#coins, lives: this.#lives }; }

    collectCoin() {
        this.#coins++;
        this.#score += RULES.coinScore;
        this.emit('change', this.snapshot);
    }

    loseLife() {
        this.#lives--;
        this.emit('change', this.snapshot);
        return this.#lives;
    }
}
