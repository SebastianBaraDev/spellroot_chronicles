class BackgroundObject extends MovableObject {

    width = 720;
    height = 240;

    /**
     * Creates one static/scrolling background layer.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X position of this background segment.
     * @param {number} y - Y position of this background segment.
     * @param {number} height - Height to draw the image at (width stays fixed at 720).
     */
    constructor(imagePath, x, y, height) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.height = height;
    }
}
