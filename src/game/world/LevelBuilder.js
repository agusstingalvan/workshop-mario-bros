import { WORLD } from '../config';
import { LEVEL } from './level';
import { HardBlock, BrickBlock, QuestionBlock } from '../entities/Block';
import { Goomba } from '../entities/Goomba';
import { Piranha } from '../entities/Piranha';

const BLOCKS = { hard: HardBlock, brick: BrickBlock, question: QuestionBlock };

export class LevelBuilder {
    #scene;

    constructor(scene) { this.#scene = scene; }

    build() {
        const scene = this.#scene;
        const tile = WORLD.tile;
        const solids = scene.physics.add.staticGroup();
        const coins = scene.physics.add.staticGroup();
        const enemies = scene.physics.add.group({ allowGravity: true });
        const hazards = scene.physics.add.group({ allowGravity: false, immovable: true });
        const entities = [];
        for (const [start, end] of LEVEL.ground) {
            for (let col = start; col < end; col++) {
                solids.create(col * tile + 9, WORLD.groundY + 9, 'tiles', col === start ? 0 : col === end - 1 ? 3 : 1).setDepth(10);
                for (let row = 1; row < 3; row++) {
                    scene.add.image(col * tile + 9, WORLD.groundY + 9 + row * tile, 'tiles', row === 1 ? 121 : 141).setDepth(10);
                }
            }
        }
        for (const [x, y, length] of LEVEL.platforms) {
            for (let col = 0; col < length; col++) {
                solids.create((x + col) * tile + 9, y * tile + 9, 'tiles', col === 0 ? 40 : col === length - 1 ? 43 : 41).setDepth(8);
            }
        }
        for (const [type, x, y] of LEVEL.blocks) new BLOCKS[type](scene, solids, x * tile + 9, y * tile + 9);
        for (const [x, height, plant] of LEVEL.pipes) {
            const top = WORLD.groundY - height * tile;
            for (let row = 0; row < height; row++) {
                const pipe = solids.create(x * tile + 18, top + row * tile + 9, 'tiles', row === 0 ? 95 : 115);
                pipe.setScale(2, 1).setDepth(10).refreshBody();
            }
            if (plant) {
                const enemy = new Piranha(scene, x * tile + 18, top, x * 10);
                hazards.add(enemy.sprite);
                entities.push(enemy);
            }
        }
        for (const x of LEVEL.goombas) {
            const enemy = new Goomba(scene, x * tile, WORLD.groundY);
            enemies.add(enemy.sprite);
            entities.push(enemy);
        }
        for (const [x, y, count] of LEVEL.coinRows) {
            for (let col = 0; col < count; col++) {
                const coin = coins.create((x + col) * tile + 9, y * tile + 9, 'tiles', 151).setDepth(7);
                coin.body.setSize(14, 14).setOffset(2, 2);
                scene.tweens.add({ targets: coin, scaleX: 0.3, duration: 400, yoyo: true, repeat: -1, delay: col * 80 });
            }
        }
        const goalX = LEVEL.goal * tile;
        for (let row = 0; row < 8; row++) scene.add.image(goalX, WORLD.groundY - 9 - row * tile, 'tiles', row === 0 ? 72 : row === 7 ? 32 : 52).setDepth(6);
        scene.add.image(goalX + 18, WORLD.groundY - 126, 'tiles', 85).setDepth(6);
        const goal = scene.add.zone(goalX, WORLD.groundY - 72, 24, 144);
        scene.physics.add.existing(goal, true);
        return { solids, coins, enemies, hazards, entities, goal };
    }
}
