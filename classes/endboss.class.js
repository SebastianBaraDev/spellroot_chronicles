class Endboss extends MovableObject {
    otherDirection = true;
    walking_sound = new Audio('audio/monster-footsteps.mp3');
    offset = { top: 80, bottom: 20, left: 200, right: 220 };
    IMAGES_RUN = [
        'img/enemies/_PNG/2/Ent_02__RUN_000.png',
        'img/enemies/_PNG/2/Ent_02__RUN_001.png',
        'img/enemies/_PNG/2/Ent_02__RUN_002.png',
        'img/enemies/_PNG/2/Ent_02__RUN_003.png',
        'img/enemies/_PNG/2/Ent_02__RUN_004.png',
        'img/enemies/_PNG/2/Ent_02__RUN_005.png',
        'img/enemies/_PNG/2/Ent_02__RUN_006.png',
        'img/enemies/_PNG/2/Ent_02__RUN_007.png',
        'img/enemies/_PNG/2/Ent_02__RUN_008.png',
        'img/enemies/_PNG/2/Ent_02__RUN_009.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_RUN[0]);
        this.loadImages(this.IMAGES_RUN);
        this.x = 2900; // Position the endboss further to the right
        this.y = -40;
        this.speed = 0.05;
        this.height = 500;
        this.width = 700;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/50); // Run at 60 FPS
        

        setInterval(() => {
                this.playAnimation(this.IMAGES_RUN);
        }, 200); 
    } 
}
