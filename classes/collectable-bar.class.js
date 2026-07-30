class CollectableBar extends DrawableObject {
    count = 0;

    /**
     * Creates the HUD counter that shows how many crystals the character has collected.
     */
    constructor() {
        super();
        this.loadImage('img/crystal.png');
        this.x = 20;
        this.y = 70; // positon above the status bar
        this.width = 40;
        this.height = 40;
    }

    /**
     * Draws the crystal icon and the current collected count next to it.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        super.draw(ctx);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle'; // vertically aligned exactly at the image's center height
        ctx.fillText('x ' + this.count, this.x + this.width + 14, this.y + this.height / 2);
    }
}
