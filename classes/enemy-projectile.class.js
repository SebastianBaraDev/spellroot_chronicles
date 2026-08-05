/**
 * A ranged attack fired by an endboss: a small glowing energy orb that flies in a
 * straight line and damages the character on contact. Drawn directly with canvas
 * primitives (no sprite asset needed) so it doesn't depend on new artwork.
 */
class EnemyProjectile extends MovableObject {
    hasHit = false;

    /**
     * @param {number} x - Starting X position (usually the shooter's center).
     * @param {number} y - Starting Y position (usually the shooter's center).
     * @param {number} [direction] - 1 to fly right, -1 to fly left. Defaults to 1.
     * @param {number} [damage] - Damage dealt to the character on impact. Defaults to 10.
     */
    constructor(x, y, direction = 1, damage = 10) {
        super();
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.offset = { top: 8, bottom: 8, left: 8, right: 8 };
        this.direction = direction;
        this.damage = damage;
        this.speed = 7;
        this.img = true; // sentinel so World.addToMap() draws this (draw() below doesn't need a real image)
        this.animate();
    }

    /**
     * Starts the projectile's straight-line flight.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            this.x += this.speed * this.direction;
        }, 1000 / 60);
    }

    /**
     * Draws the projectile as a small glowing energy orb.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;

        const gradient = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.45, '#b25bff');
        gradient.addColorStop(1, 'rgba(70, 0, 110, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}
