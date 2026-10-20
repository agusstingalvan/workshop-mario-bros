import { WORLD } from '../config';

export function addScenery(scene, width = WORLD.width) {
    scene.cameras.main.setBackgroundColor('#91d9e6');
    const graphics = scene.add.graphics().setDepth(-5);
    graphics.fillStyle(0xbde9df);
    for (let x = -80; x < width; x += 230) {
        graphics.fillTriangle(x, 330, x + 140, 180, x + 280, 330);
        graphics.fillRect(x + 115, 205, 45, 125);
    }
    graphics.fillStyle(0x83c9b1);
    for (let x = -50; x < width; x += 180) graphics.fillTriangle(x, 330, x + 100, 252, x + 200, 330);
    for (let x = 60; x < width; x += 235) {
        for (let part = 0; part < 4; part++) {
            scene.add.image(x + part * 18, 65 + (Math.floor(x / 235) % 3) * 24, 'tiles', 153 + part).setDepth(-3);
        }
    }
}
