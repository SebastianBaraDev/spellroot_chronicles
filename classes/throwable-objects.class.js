class ThrowableObject extends MovableObject {

    speedY = -20;
    speedX = 10;
    rotationAngle = 45;


    constructor(x, y) {
        super();
        this.loadImage('img/potion.png');
        this.x = x ?? 100 ;
        this.y = y ?? 300;
        this.width = 50;
        this.height = 50;
    }

    throw(direction = 1) {
        this.speedY = -20; // Initial upward speed
        this.speedX = 10 * direction;  // Initial forward speed
        this.applyGravity();
        this.animateRotation();
    }

        applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y += this.speedY;
                this.speedY += this.acceleration;
            }
            this.x += this.speedX;
        }, 1000 / 25);
    }

        isAboveGround() {
        return this.y < 450; // Bodenhöhe anpassen
    }

    animateRotation() {
        setInterval(() => {
            this.rotationAngle = this.rotationAngle === 45 ? -45 : 45;
        }, 100);
    }

    draw(ctx) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const radians = this.rotationAngle * (Math.PI / 180);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(radians);
        ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }


    }