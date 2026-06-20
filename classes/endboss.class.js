class Endboss extends MovableObject {
    otherDirection = true;
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
        this.x = 3000; // Position the endboss further to the right
        this.y = -40;
        this.height = 500;
        this.width = 700;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
                this.playAnimation(this.IMAGES_RUN);
        }, 200); 
    } 
}
