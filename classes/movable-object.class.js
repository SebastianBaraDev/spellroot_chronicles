class MovableObject {
    x = 120;
    y = 260;
    img;
    height = 200;
    width = 300;
    speed = 0.05;
    imageCache = [];
    currentImage = 0;

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

    moveRight() {
        console.log('Moving right');
    }

    moveLeft() {
        setInterval(() => {
        this.x -= this.speed || 0.05; // Move left at a constant speed
        }, 1000/60); // Run at 60 FPS
    }
}