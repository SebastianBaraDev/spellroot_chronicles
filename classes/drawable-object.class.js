class DrawableObject {
    img;
    imageCache = [];
    currentImage = 0;
    x = 120;
    y = 260;
    height = 200;
    width = 300;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx){
        if (this.otherDirection) {
            ctx.drawImage(this.img, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

        drawFrame(ctx) {
        // Debug-Rahmen deaktiviert
    }
}