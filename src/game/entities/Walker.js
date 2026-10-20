// Componente compartido de patrulla para Goomba y Super Mushroom.
export class Walker {
    #speed;
    #direction;

    constructor(speed, direction = -1) {
        this.#speed = speed;
        this.#direction = direction;
    }

    update(sprite) {
        if (!sprite.active || !sprite.body.enable) return;
        if (sprite.body.blocked.left) this.#direction = 1;
        else if (sprite.body.blocked.right) this.#direction = -1;
        sprite.setVelocityX(this.#speed * this.#direction);
        if (sprite.y > 430) sprite.destroy();
    }
}
