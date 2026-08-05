class ThrowableObject extends MovableObject {

    speedY = -20;
    speedX = 10;
    rotationAngle = 45;

    /**
     * Creates a throwable potion bottle.
     * @param {number} [x] - X position it is thrown from. Defaults to 100 if omitted.
     * @param {number} [y] - Y position it is thrown from. Defaults to 300 if omitted.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/potion.png');
        this.x = x ?? 100 ;
        this.y = y ?? 300;
        this.width = 50;
        this.height = 50;
    }

    /**
     * Launches the bottle in the given direction and starts its flight physics/rotation.
     * @param {number} [direction] - 1 to throw right, -1 to throw left. Defaults to 1.
     * @returns {void}
     */
    throw(direction = 1) {
        this.speedY = -20; // Initial upward speed
        this.speedX = 10 * direction;  // Initial forward speed
        this.applyGravity();
        this.animateRotation();
    }

    /**
     * Applies a simple gravity/forward-motion physics tick to the bottle while it's in flight.
     * @returns {void}
     */
    applyGravity() {
        this.registerInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            }
            this.x += this.speedX;
        }, 1000 / 25);
    }

    /**
     * Checks whether the bottle is still above ground level.
     * @returns {boolean} true while the bottle hasn't reached the ground yet.
     */
    isAboveGround() {
        return this.y < 450; // adjust ground height
    }

    /**
     * Starts the bottle's back-and-forth tumbling rotation while it flies.
     * @returns {void}
     */
    animateRotation() {
        this.registerInterval(() => {
            this.rotationAngle = this.rotationAngle === 45 ? -45 : 45;
        }, 100);
    }

    /**
     * Draws the bottle rotated around its own center to match the current tumble angle.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radians = this.rotationAngle * (Math.PI / 180);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(radians);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

}
