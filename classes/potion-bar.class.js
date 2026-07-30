class PotionBar extends DrawableObject {
    count = 0;

    /**
     * Creates the HUD counter that shows how many potions the character is carrying.
     */
    constructor() {
        super();
        this.loadImage('img/potion.png');
        this.x = 22;
        this.y = 120; // directly below the CollectableBar (which is at y = 90, height = 40)
        this.width = 40;
        this.height = 40;
    }

    /**
     * Draws the potion icon and the current potion count next to it.
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
