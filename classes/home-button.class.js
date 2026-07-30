class HomeButton extends DrawableObject {
    /**
     * Creates the home button that returns to the start screen, positioned left of the sound button.
     * @param {number} canvasWidth - Width of the game canvas, used to position the button.
     * @param {Function} onClick - Callback invoked when the button is clicked.
     */
    constructor(canvasWidth, onClick) {
        super();
        this.width = 36;
        this.height = 36;
        this.x = canvasWidth - 40 - 20 - this.width - 12; // sits left of the sound button, same top row
        this.y = 22;
        this.onClick = onClick;
        this.loadImage('img/homescreen.png');
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
     * Triggers the button's callback if the click landed on it.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    handleClick(mouseX, mouseY) {
        if (!this.isClicked(mouseX, mouseY)) return;
        this.onClick();
    }

    /**
     * Draws the button icon, inverted so the dark artwork shows up against the dark HUD.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.img) return;

        ctx.filter = 'invert(1)'; // image is dark, invert(1) makes it visible on the dark HUD
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.filter = 'none';
    }
}
