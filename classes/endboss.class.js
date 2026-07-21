class Endboss extends MovableObject {
    otherDirection = true;
    walking_sound = new Audio('audio/monster-footsteps.mp3');
    energy = 20;
    offset = { top: 80, bottom: 20, left: 200, right: 220 };
    IMAGES_WALK = [
        'img/enemies/_PNG/2/Ent_02__WALK_000.png',
        'img/enemies/_PNG/2/Ent_02__WALK_001.png',
        'img/enemies/_PNG/2/Ent_02__WALK_002.png',
        'img/enemies/_PNG/2/Ent_02__WALK_003.png',
        'img/enemies/_PNG/2/Ent_02__WALK_004.png',
        'img/enemies/_PNG/2/Ent_02__WALK_005.png',
        'img/enemies/_PNG/2/Ent_02__WALK_006.png',
        'img/enemies/_PNG/2/Ent_02__WALK_007.png',
        'img/enemies/_PNG/2/Ent_02__WALK_008.png',
        'img/enemies/_PNG/2/Ent_02__WALK_009.png',
    ];
    IMAGES_HURT = [
        'img/enemies/_PNG/2/Ent_02__HURT_000.png',
        'img/enemies/_PNG/2/Ent_02__HURT_001.png',
        'img/enemies/_PNG/2/Ent_02__HURT_002.png',
        'img/enemies/_PNG/2/Ent_02__HURT_003.png',
        'img/enemies/_PNG/2/Ent_02__HURT_004.png',
        'img/enemies/_PNG/2/Ent_02__HURT_005.png',
        'img/enemies/_PNG/2/Ent_02__HURT_006.png',
        'img/enemies/_PNG/2/Ent_02__HURT_007.png',
        'img/enemies/_PNG/2/Ent_02__HURT_008.png',
        'img/enemies/_PNG/2/Ent_02__HURT_009.png',
    ];
    IMAGES_DIE = [
        'img/enemies/_PNG/2/Ent_02__DIE_000.png',
        'img/enemies/_PNG/2/Ent_02__DIE_001.png',
        'img/enemies/_PNG/2/Ent_02__DIE_002.png',
        'img/enemies/_PNG/2/Ent_02__DIE_003.png',
        'img/enemies/_PNG/2/Ent_02__DIE_004.png',
        'img/enemies/_PNG/2/Ent_02__DIE_005.png',
        'img/enemies/_PNG/2/Ent_02__DIE_006.png',
        'img/enemies/_PNG/2/Ent_02__DIE_007.png',
        'img/enemies/_PNG/2/Ent_02__DIE_008.png',
        'img/enemies/_PNG/2/Ent_02__DIE_009.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
        this.x = 2900; // Position the endboss further to the right
        this.y = -40;
        this.speed = 0.05;
        this.height = 500;
        this.width = 700;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else {
                this.playAnimation(this.IMAGES_WALK);
            }
        }, 100);
    }
}
