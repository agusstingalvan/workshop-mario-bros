/**
 * Tuning de movimiento de Mario (spec 003). Unidades de mundo, sin zoom.
 * El salto y sus constantes se agregan en la spec 004.
 */
export const MARIO_MOVEMENT = Object.freeze({
    MAX_SPEED: 100,
    GROUND_ACCELERATION: 800,
    GROUND_DECELERATION: 1200,
    AIR_ACCELERATION: 600,
    GRAVITY_RISING: 1200,
    GRAVITY_FALLING: 2100,
    TERMINAL_VELOCITY: 600,
    JUMP_VELOCITY: -400,
    JUMP_BUFFER_MS: 120,
    COYOTE_TIME_MS: 100
});
