class Endboss extends MovableObject {
    otherDirection = true;
    energy = 25; // 5 Treffer mit einer Flasche (je 5 Schaden) noetig
    footstepsSound = new Audio('audio/monster-footsteps.mp3');
    hurtSound = new Audio('audio/deep-growl.mp3');
    offset = { top: 30, bottom: 15, left: 248, right: 230 }; // an die tatsaechliche Sprite-Silhouette angepasst

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
        this.x = 4338; // weiter nach hinten versetzt (Level um ein weiteres Segment verlaengert)
        this.y = -40;
        this.speed = 0.1;
        this.height = 500;
        this.width = 700;
        this.animate();
        this.footstepsSound.loop = true; // Set the footsteps sound to loop
        this.footstepsSound.volume = 0.3; // Set the volume to 30%
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
        }, 150);

        setInterval(() => this.handleFootstepsSound(), 300);
    }

    handleFootstepsSound() {
        if (!this.world) return; // world ist am Anfang noch nicht gesetzt

        if (this.isDead()) {
            this.footstepsSound.pause();
            return;
        }

        const isVisible = this.x + this.width > -this.world.camera_x
            && this.x < -this.world.camera_x + this.world.canvas.width;

        isVisible ? this.footstepsSound.play() : this.footstepsSound.pause();
    }

    hit() {
        super.hit();
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
    }
}
