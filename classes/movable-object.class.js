class MovableObject {
    x = 120;
    y = 260;
    img;
    height = 200;
    width = 300;
    speed = 0.05;
    imageCache = [];
    currentImage = 0;
    OtherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    energy = 100;


    applyGravity () {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 130
    }

    loadImage(path) {
        this.img = new Image(); //this.img = document.getElementById(Image) <img id="Image">
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

    isColliding(other) {
        const o1 = this.offset || { top: 0, bottom: 0, left: 0, right: 0 };
        const o2 = other.offset || { top: 0, bottom: 0, left: 0, right: 0 };

        return (
            this.x + o1.left < other.x + other.width - o2.right &&
            this.x + this.width - o1.right > other.x + o2.left &&
            this.y + o1.top < other.y + other.height - o2.bottom &&
            this.y + this.height - o1.bottom > other.y + o2.top
        );
    }

    playAnimation(images){
            let i = this.currentImage % images.length; // Loop through images
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed || 0.05;
    }

    jump() {
        this.speedY = 30;
    }
}