// Unidades del mundo: píxeles originales del pack; la cámara amplía al doble.
export const WORLD = { width: 3456, height: 384, groundY: 330, tile: 18, zoom: 2 };
export const PLAYER = {
    speed: 112, jump: 330, gravity: 680, fallGravity: 380,
    coyoteMs: 110, bufferMs: 140, invulnerabilityMs: 2000, bounce: 190,
    startX: 54, startY: 328
};
export const RULES = { lives: 3, coinScore: 100, enemySpeed: 30, mushroomSpeed: 43 };
export const COLORS = { ink: '#173c46', paper: '#fff4d9', muted: '#a9c9c5', gold: '#ffd36b' };
export const TEXT = { fontFamily: 'monospace', color: COLORS.paper };
