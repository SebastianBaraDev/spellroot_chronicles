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


    applyGravity () {
        setInterval(() => {
            if(this.isAboveGround()) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        return this.y < 120
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

    playAnimation(images){
            let i = this.currentImage % images.length; // Loop through images
            let path = images[i];
            this.img = this.imageCache[path];
            this.currentImage++;
    }

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        setInterval(() => {
        this.x -= this.speed || 0.05; // Move left at a constant speed
        }, 1000/60); // Run at 60 FPS
    }
}