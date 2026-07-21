class Enemie extends MovableObject {
    height = 180;
    width = 300;
    y = 250;
    otherDirection = true; // Assuming enemies face left by default
    energy = 5;
    offset = { top: 20, bottom: 0, left: 90, right: 100 };
    IMAGES_RUN = [
            'img/enemies/_PNG/1/Ent_01__RUN_000.png',
            'img/enemies/_PNG/1/Ent_01__RUN_001.png',
            'img/enemies/_PNG/1/Ent_01__RUN_002.png',
            'img/enemies/_PNG/1/Ent_01__RUN_003.png',
            'img/enemies/_PNG/1/Ent_01__RUN_004.png',
            'img/enemies/_PNG/1/Ent_01__RUN_005.png',
            'img/enemies/_PNG/1/Ent_01__RUN_006.png',
            'img/enemies/_PNG/1/Ent_01__RUN_007.png',
            'img/enemies/_PNG/1/Ent_01__RUN_008.png',
            'img/enemies/_PNG/1/Ent_01__RUN_009.png',
        ];
    IMAGES_DIE = [
            'img/enemies/_PNG/1/Ent_01__DIE_000.png',
            'img/enemies/_PNG/1/Ent_01__DIE_001.png',
            'img/enemies/_PNG/1/Ent_01__DIE_002.png',
            'img/enemies/_PNG/1/Ent_01__DIE_003.png',
            'img/enemies/_PNG/1/Ent_01__DIE_004.png',
            'img/enemies/_PNG/1/Ent_01__DIE_005.png',
            'img/enemies/_PNG/1/Ent_01__DIE_006.png',
            'img/enemies/_PNG/1/Ent_01__DIE_007.png',
            'img/enemies/_PNG/1/Ent_01__DIE_008.png',
            'img/enemies/_PNG/1/Ent_01__DIE_009.png',
        ];  

    constructor() {
        super().loadImage('./img/enemies/_PNG/1/Ent_01__RUN_000.png');
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_DIE);

        this.x = 200 + Math.random() * 2000; // Random x position for each enemy
        this.speed = 0.15 + Math.random() * 0.5; // Random speed for each enemy
        this.animate();
    }


    animate() {
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else {
                this.playAnimation(this.IMAGES_RUN);
            }
        }, 100);
    }
}