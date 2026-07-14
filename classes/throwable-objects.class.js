class ThrowableObject extends MovableObject {

    speedY = 15;
    speedX = 10;


    constructor() {
        super();
        this.loadImage('img/6_salsa_bottle/bottle_rotation.png');
    }

    shot() {
        this.applyGravity();
        this.speedX = 10;
        this.x += this.speedX;
    }



    }