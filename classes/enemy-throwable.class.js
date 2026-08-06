/**
 * A close-range attack thrown by an endboss: a bluish glowing orb that flies in an
 * arc (gravity + rotation), just like the potions the character throws, and damages
 * the character on contact. Fills the "dead zone" below the ranged shot's minimum
 * range, so getting in close doesn't make the endboss harmless from a distance-attack
 * point of view. Drawn directly with canvas primitives, no sprite asset needed.
 */
class EnemyThrowable extends MovableObject {
    hasHit = false;
    rotationAngle = 45;

    /**
     * @param {number} x - Starting X position (usually the shooter's center).
     * @param {number} y - Starting Y position (usually the shooter's center).
     * @param {number} [direction] - 1 to fly right, -1 to fly left. Defaults to 1.
     * @param {number} [damage] - Damage dealt to the character on impact. Defaults to 8.
     */
    constructor(x, y, direction = 1, damage = 8) {
        super();
        this.x = x;
        this.y = y;
        this.width = 34;
        this.height = 34;
        this.offset = { top: 6, bottom: 6, left: 6, right: 6 };
        this.direction = direction;
        this.damage = damage;
        this.speedY = -18; // initial upward arc, same shape as the character's potion throw
        this.speedX = 9 * direction;
        this.img = true; // sentinel so World.addToMap() draws this (draw() below doesn't need a real image)
        this.applyThrowPhysics();
        this.animateRotation();
    }

    /**
     * Flies the orb along a gravity arc, just like ThrowableObject's potion throw.
     * @returns {void}
     */
    applyThrowPhysics() {
        this.registerInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            }
            this.x += this.speedX;
        }, 1000 / 25);
    }

    /**
     * Checks whether the orb is still above ground level.
     * @returns {boolean} true while the orb hasn't reached the ground yet.
     */
    isAboveGround() {
        return this.y < 450; // same ground height as ThrowableObject
    }

    /**
     * Starts the orb's back-and-forth tumbling rotation while it flies.
     * @returns {void}
     */
    animateRotation() {
        this.registerInterval(() => {
            this.rotationAngle = this.rotationAngle === 45 ? -45 : 45;
        }, 100);
    }

    /**
     * Draws the orb rotated around its own center as a glowing bluish sphere.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radius = this.width / 2;
        const radians = this.rotationAngle * (Math.PI / 180);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(radians);

        const gradient = ctx.createRadialGradient(0, 0, 1, 0, 0, radius);
        gradient.addColorStop(0, '#eaf8ff');
        gradient.addColorStop(0.45, '#3fa9f5');
        gradient.addColorStop(1, 'rgba(10, 40, 110, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
