import { TEXT, COLORS } from '../config';

export function label(scene, x, y, text, size = 20, color = COLORS.paper) {
    return scene.add.text(x, y, text, { ...TEXT, fontSize: size, color });
}

export function button(scene, x, y, text, action) {
    const background = scene.add.rectangle(x, y + 5, 300, 60, 0x092b33);
    const face = scene.add.rectangle(x, y, 300, 60, 0xffd36b).setStrokeStyle(2, 0xffe5a6);
    const caption = label(scene, x, y, text, 23, COLORS.ink).setOrigin(0.5);
    face.setInteractive({ useHandCursor: true });
    face.on('pointerover', () => face.setFillStyle(0xffe5a6));
    face.on('pointerout', () => face.setFillStyle(0xffd36b));
    face.on('pointerdown', action);
    return [background, face, caption];
}

export function digits(scene, x, y, value, length = 2, scale = 2, large = false) {
    const images = [];
    String(value).padStart(length, '0').split('').forEach((digit, index) => {
        images.push(scene.add.image(x + index * 12 * scale, y, 'tiles', (large ? 170 : 160) + Number(digit)).setScale(scale));
    });
    return images;
}
