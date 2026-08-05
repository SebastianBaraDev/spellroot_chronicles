class PauseButton extends DrawableObject {
    isPaused = false;

    /**
     * Creates the pause/resume button, positioned left of the home button. Freezing
     * the game (character, enemies, physics, collisions) makes it much easier to
     * calibrate hitbox offsets with the H debug overlay, since nothing moves while paused.
     * @param {number} canvasWidth - Width of the game canvas, used to position the button.
     * @param {Function} onToggle - Callback invoked with the new paused state whenever it's toggled.
     */
    constructor(canvasWidth, onToggle) {
        super();
        this.width = 36;
        this.height = 36;
        this.x = canvasWidth - 40 - 20 - 36 - 12 - 36 - 12; // sits left of the home button, same top row
        this.y = 22;
        this.onToggle = onToggle;
        this.img = true; // sentinel so World.addToMap() draws this - drawn with canvas shapes below, no sprite needed
    }

    /**
     * Checks whether the given canvas coordinates lie inside the button.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {boolean} true if the point is inside the button's bounds.
     */
    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width
            && mouseY >= this.y && mouseY <= this.y + this.height;
    }

    /**
     * Toggles the paused state if the click landed on the button and notifies the caller.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    handleClick(mouseX, mouseY) {
        if (!this.isClicked(mouseX, mouseY)) return;

        this.isPaused = !this.isPaused;
        this.onToggle(this.isPaused);
    }

    /**
     * Draws a play triangle while paused (click to resume) or two pause bars while
     * running (click to pause), matching the flat white icon look of the other HUD buttons.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';

        if (this.isPaused) {
            this.drawPlayTriangle(ctx);
        } else {
            this.drawPauseBars(ctx);
        }

        ctx.restore();
    }

    /**
     * Draws the play triangle icon (shown while paused).
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    drawPlayTriangle(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const size = this.width * 0.32;

        ctx.beginPath();
        ctx.moveTo(cx - size * 0.6, cy - size);
        ctx.lineTo(cx - size * 0.6, cy + size);
        ctx.lineTo(cx + size * 0.9, cy);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Draws the two pause bars icon (shown while running).
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    drawPauseBars(ctx) {
        const barWidth = this.width * 0.16;
        const barHeight = this.height * 0.55;
        const gap = this.width * 0.14;
        const top = this.y + (this.height - barHeight) / 2;
        const centerX = this.x + this.width / 2;

        ctx.fillRect(centerX - gap - barWidth, top, barWidth, barHeight);
        ctx.fillRect(centerX + gap, top, barWidth, barHeight);
    }
}
