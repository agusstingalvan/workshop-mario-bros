import { Physics } from 'phaser';
import { CHARACTERS } from '../constants/assets.js';
import { MARIO_MOVEMENT } from '../constants/movement.js';

const WALK_ANIMATION_KEY = 'mario_walk';
const WALK_ANIMATION_THRESHOLD = 5;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Mario en estado Small. Concentra su cuerpo físico, movimiento y animación;
 * la escena solo le pasa las intenciones de input y lo colisiona con el nivel.
 */
export class Mario extends Physics.Arcade.Sprite
{
    #bufferMs = 0;
    #coyoteMs = 0;

    constructor (scene, x, y)
    {
        const data = CHARACTERS.SMALL_MARIO;

        super(scene, x, y, data.texture, data.frames[0]);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const hitbox = data.hitbox;

        this.setOrigin(data.origin.x, data.origin.y);
        this.body.setSize(hitbox.width, hitbox.height, false);
        this.body.setOffset(
            (data.rects[0].width - hitbox.width) / 2,
            data.rects[0].height - hitbox.height
        );
        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(MARIO_MOVEMENT.MAX_SPEED, MARIO_MOVEMENT.TERMINAL_VELOCITY);
        this.body.setGravityY(MARIO_MOVEMENT.GRAVITY_FALLING);

        console.info(`[mario] hitbox ${this.body.width}×${this.body.height} · origen (${data.origin.x}, ${data.origin.y})`);
    }

    update (input, delta)
    {
        const seconds = delta / 1000;
        const body = this.body;
        const onGround = body.blocked.down || body.touching.down;

        this.#updateJump(onGround, input.jumpPressed, delta);

        if (input.left !== input.right)
        {
            const direction = input.left ? -1 : 1;
            const acceleration = onGround
                ? MARIO_MOVEMENT.GROUND_ACCELERATION
                : MARIO_MOVEMENT.AIR_ACCELERATION;

            body.velocity.x = clamp(
                body.velocity.x + direction * acceleration * seconds,
                -MARIO_MOVEMENT.MAX_SPEED,
                MARIO_MOVEMENT.MAX_SPEED
            );
            this.setFlipX(direction < 0);
        }
        else if (onGround)
        {
            const braking = MARIO_MOVEMENT.GROUND_DECELERATION * seconds;

            body.velocity.x = Math.abs(body.velocity.x) <= braking
                ? 0
                : body.velocity.x - Math.sign(body.velocity.x) * braking;
        }

        body.setGravityY(
            body.velocity.y < 0
                ? MARIO_MOVEMENT.GRAVITY_RISING
                : MARIO_MOVEMENT.GRAVITY_FALLING
        );

        this.#updateAnimation(onGround);
    }

    #updateJump (onGround, jumpPressed, delta)
    {
        this.#coyoteMs = onGround
            ? MARIO_MOVEMENT.COYOTE_TIME_MS
            : Math.max(0, this.#coyoteMs - delta);

        this.#bufferMs = jumpPressed
            ? MARIO_MOVEMENT.JUMP_BUFFER_MS
            : Math.max(0, this.#bufferMs - delta);

        if (this.#bufferMs > 0 && (onGround || this.#coyoteMs > 0))
        {
            this.#jump();
        }
    }

    #jump ()
    {
        this.body.setVelocityY(MARIO_MOVEMENT.JUMP_VELOCITY);
        this.#bufferMs = 0;
        this.#coyoteMs = 0;
    }

    #updateAnimation (onGround)
    {
        if (!onGround)
        {
            this.anims.stop();
            this.setFrame(CHARACTERS.SMALL_MARIO.frames[1]);
            return;
        }

        const body = this.body;
        const blockedAhead = (body.velocity.x > 0 && body.blocked.right)
            || (body.velocity.x < 0 && body.blocked.left);
        const walking = Math.abs(body.velocity.x) > WALK_ANIMATION_THRESHOLD && !blockedAhead;

        if (walking)
        {
            this.play(WALK_ANIMATION_KEY, true);
            return;
        }

        this.anims.stop();
        this.setFrame(CHARACTERS.SMALL_MARIO.frames[0]);
    }
}
