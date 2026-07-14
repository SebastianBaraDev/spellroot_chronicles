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
        const o = this.offset || { top: 0, bottom: 0, left: 0, right: 0 };

        if ( this instanceof Character || this instanceof Enemie || this instanceof Endboss){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.rect(
                this.x + o.left,
                this.y + o.top,
                this.width - o.left - o.right,
                this.height - o.top - o.bottom
            );
            ctx.stroke();
        }
    }
}