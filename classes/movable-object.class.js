class MovableObject extends DrawableObject {
    speed = 0.05;
    OtherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    deathAnimationStarted = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };


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

    hit() {
        this.energy -= 5;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 0.5;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images, loop = true){
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            if (loop || this.currentImage < images.length - 1) {
                this.currentImage++;
            }
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

    playDeathAnimation() {
        if (!this.deathAnimationStarted) {
            this.currentImage = 0;
            this.deathAnimationStarted = true;
        }
        this.playAnimation(this.IMAGES_DIE, false);
    }
    
}