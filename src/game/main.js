import { Game as MainGame } from './scenes/Game';
import { AUTO, Scale, Game } from 'phaser';
import { Boot } from './scenes/Boot';
import { Menu } from './scenes/Menu';
import { World } from './scenes/World';
import { Hud } from './scenes/Hud';
import { End } from './scenes/End';
import { PLAYER } from './config';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    pixelArt: true,
    roundPixels: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: PLAYER.gravity }, debug: false }
    },
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Boot, Menu, World, MainGame, Hud, End
    ]
};

const StartGame = (parent) => {
    return new Game({ ...config, parent });
}

export default StartGame;
