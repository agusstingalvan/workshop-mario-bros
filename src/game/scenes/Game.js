import { Scene } from 'phaser';
import { WORLD, TEXT } from '../config';
import { Player } from '../entities/Player';
import { Mushroom } from '../entities/Mushroom';
import { LevelBuilder } from '../world/LevelBuilder';
import { addScenery } from '../world/scenery';

export class Game extends Scene {
    #player;
    #level;
    #items;
    #entities = [];
    #state = 'playing';

    constructor() { super('Game'); }

    create() {
        this.#state = 'playing';
        this.#entities = [];
        addScenery(this);
        this.#level = new LevelBuilder(this).build();
        this.#player = new Player(this);
        this.#items = this.physics.add.group();
        const { solids, coins, enemies, hazards, goal } = this.#level;
        const playerSprite = this.#player.sprite;
        this.physics.add.collider(playerSprite, solids, (_player, solid) => {
            if (playerSprite.body.blocked.up && solid.body.top < playerSprite.body.top) {
                // Super Mario puede rozar dos celdas. Prima el bloque sobre el
                // centro de la cabeza, no el primer vecino resuelto por Arcade.
                const body = playerSprite.body;
                const overhead = solids.getChildren().find(block => block.getData('entity')?.hit
                    && body.center.x >= block.body.left && body.center.x < block.body.right
                    && Math.abs(block.body.bottom - body.top) < 2);
                (overhead ?? solid).getData('entity')?.hit(this.#player);
            }
        });
        this.physics.add.collider(enemies, solids);
        this.physics.add.collider(this.#items, solids);
        this.physics.add.overlap(playerSprite, coins, (_player, coin) => {
            if (this.#state !== 'playing') return;
            const { x, y } = coin;
            this.tweens.killTweensOf(coin);
            coin.destroy();
            this.registry.get('session').collectCoin();
            this.floatText(x, y - 8, '+100');
        });
        this.physics.add.overlap(playerSprite, enemies, (_player, enemy) => {
            if (this.#state === 'playing') enemy.getData('entity').touch(this.#player);
        });
        this.physics.add.overlap(playerSprite, hazards, (_player, enemy) => {
            if (this.#state === 'playing') enemy.getData('entity').touch(this.#player);
        });
        this.physics.add.overlap(playerSprite, this.#items, (_player, item) => {
            if (this.#state === 'playing') item.getData('entity').touch(this.#player);
        });
        this.physics.add.overlap(playerSprite, goal, () => this.#complete());
        this.cameras.main.setZoom(WORLD.zoom).setBounds(0, 0, WORLD.width, WORLD.height)
            .startFollow(playerSprite, true, 1, 1, -80, 0);
        this.scene.launch('Hud');
        this.events.once('shutdown', () => this.scene.stop('Hud'));
    }

    spawnMushroom(x, y) {
        const item = new Mushroom(this, x, y);
        this.#items.add(item.sprite);
        item.sprite.body.enable = false;
        this.#entities.push(item);
    }

    floatText(x, y, message) {
        const text = this.add.text(x, y, message, { ...TEXT, fontSize: 9, color: '#173c46', fontStyle: 'bold' })
            .setOrigin(0.5).setDepth(25);
        this.tweens.add({ targets: text, y: y - 22, alpha: 0, duration: 800, onComplete: () => text.destroy() });
    }

    loseLife() {
        if (this.#state !== 'playing') return;
        this.#state = 'dying';
        this.#player.stop(true);
        this.physics.pause();
        const remaining = this.registry.get('session').loseLife();
        this.cameras.main.shake(180, 0.006);
        this.tweens.add({ targets: this.#player.sprite, y: this.#player.sprite.y - 35, alpha: 0, duration: 650 });
        this.time.delayedCall(850, () => {
            this.scene.stop('Hud');
            if (remaining > 0) this.scene.start('World');
            else this.scene.start('End', { won: false });
        });
    }

    #complete() {
        if (this.#state !== 'playing') return;
        this.#state = 'won';
        this.#player.stop();
        this.physics.pause();
        this.floatText(this.#player.sprite.x, this.#player.sprite.y - 45, '¡META!');
        this.time.delayedCall(1000, () => {
            this.scene.stop('Hud');
            this.scene.start('End', { won: true });
        });
    }

    update(time) {
        if (this.#state !== 'playing') return;
        this.#player.update(time);
        for (const entity of this.#level.entities) entity.update(time);
        for (const entity of this.#entities) entity.update(time);
        if (this.#player.sprite.y > WORLD.height + 28) this.loseLife();
    }
}
