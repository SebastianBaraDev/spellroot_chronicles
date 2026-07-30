class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 260;
    height = 200;
    width = 300;

    /**
     * Loads a single static image and stores it as this object's current image.
     * @param {string} path - Path to the image file.
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads a list of animation frame images into the shared image cache, keyed by path.
     * @param {string[]} arr - Paths of the frame images to preload.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object's current image at its position (or at the origin when flipped -
     * flipping is handled by the caller via a canvas transform).
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx){
        if (this.otherDirection) {
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Hook for drawing a debug hitbox frame around the object. Currently disabled.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    drawFrame(ctx) {
        // debug frame disabled
    }
}
