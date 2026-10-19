import { Scene } from 'phaser';
import { CHARACTERS, TEXTURES, TILES } from '../constants/assets.js';

const PREVIEW_SCALE = 4;
const PREVIEW_BASELINE = 500;

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    preload ()
    {
        this.load.setPath('assets');

        Object.values(TEXTURES).forEach((sheet) =>
        {
            this.load.spritesheet(sheet.key, sheet.file, {
                frameWidth: sheet.frameWidth,
                frameHeight: sheet.frameHeight
            });
        });
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#1d2b53');

        this.add.text(512, 80, 'SPEC 001 · Carga de assets', {
            fontFamily: 'monospace', fontSize: 30, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 124, 'Escena base de validación · escala ×4', {
            fontFamily: 'monospace', fontSize: 18, color: '#a8d8ff'
        }).setOrigin(0.5);

        this.add.text(330, 210, 'tiles · 18 × 18', {
            fontFamily: 'monospace', fontSize: 20, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(694, 210, 'characters · 24 × 24', {
            fontFamily: 'monospace', fontSize: 20, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.rectangle(512, PREVIEW_BASELINE, 720, 2, 0xffffff, 0.25);

        this.#addTile(TILES.HARD_BLOCK, 250, 'hard block');
        this.#addTile(TILES.QUESTION_BLOCK, 370, '? block');
        this.#addCharacter(CHARACTERS.SMALL_MARIO, 620, 'small mario');
        this.#addCharacter(CHARACTERS.GOOMBA, 750, 'goomba');

        const report = this.#textureReport();

        console.info('[assets]', report);

        this.add.text(512, 640, report, {
            fontFamily: 'monospace', fontSize: 20, color: '#9fe870', align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 700, 'pixelArt: nearest · sin antialias · escalas enteras', {
            fontFamily: 'monospace', fontSize: 16, color: '#a8d8ff'
        }).setOrigin(0.5);
    }

    #addTile (tile, x, label)
    {
        this.add.image(x, PREVIEW_BASELINE, tile.texture, tile.frame)
            .setOrigin(0.5, 1)
            .setScale(PREVIEW_SCALE);

        this.add.text(x, PREVIEW_BASELINE + 24, label, {
            fontFamily: 'monospace', fontSize: 16, color: '#ffffff'
        }).setOrigin(0.5, 0);
    }

    #addCharacter (character, x, label)
    {
        this.add.image(x, PREVIEW_BASELINE, character.texture, character.frames[0])
            .setOrigin(character.origin.x, character.origin.y)
            .setScale(PREVIEW_SCALE);

        this.add.text(x, PREVIEW_BASELINE + 24, label, {
            fontFamily: 'monospace', fontSize: 16, color: '#ffffff'
        }).setOrigin(0.5, 0);
    }

    #textureReport ()
    {
        return Object.values(TEXTURES).map((sheet) =>
        {
            const texture = this.textures.get(sheet.key);
            const frames = texture.getFrameNames().length;
            const image = texture.getSourceImage();
            const status = frames === sheet.frameCount ? 'OK' : `ESPERADOS ${sheet.frameCount}`;

            if (frames !== sheet.frameCount)
            {
                console.warn(`[assets] ${sheet.key}: se esperaban ${sheet.frameCount} frames y se cargaron ${frames}`);
            }

            return `${sheet.key}: ${frames}/${sheet.frameCount} frames · ${image.width}×${image.height} px · ${status}`;
        }).join('   |   ');
    }
}
