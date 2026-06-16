class Enemie extends MovableObject {
    height = 180;
    width = 300;
    y = 250;
    otherDirection = true; // Assuming enemies face left by default
    constructor() {
        super().loadImage('./img/enemies/_PNG/1/Ent_01__IDLE_000.png');

        this.x = 200 + Math.random() * 500; // Random x position for each enemy
        this.animate();
    }

    animate() {
        setInterval(() => {
        this.x -= 0.15;
        }, 1000/60); // Run at 60 FPS
    }
}