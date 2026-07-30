class EnemieLevel2 extends MovableObject {
    height = 120;
    width = 200;
    groundY = 310; // Grundlinie, an 2/3-Groesse angepasst (gleiche Standflaeche wie Level-1-Gegner)
    y = 310;
    otherDirection = true;
    energy = 5;
    speedY = 0;
    jumping = false;
    offset = { top: 12, bottom: 4, left: 65, right: 59 }; // proportional (2/3) vom Level-1-Offset skaliert

    IMAGES_RUN = [
        'img/enemies/_PNG/3/Ent_03__RUN_000.png',
        'img/enemies/_PNG/3/Ent_03__RUN_001.png',
        'img/enemies/_PNG/3/Ent_03__RUN_002.png',
        'img/enemies/_PNG/3/Ent_03__RUN_003.png',
        'img/enemies/_PNG/3/Ent_03__RUN_004.png',
        'img/enemies/_PNG/3/Ent_03__RUN_005.png',
        'img/enemies/_PNG/3/Ent_03__RUN_006.png',
        'img/enemies/_PNG/3/Ent_03__RUN_007.png',
        'img/enemies/_PNG/3/Ent_03__RUN_008.png',
        'img/enemies/_PNG/3/Ent_03__RUN_009.png',
    ];
    IMAGES_JUMP = [
        'img/enemies/_PNG/3/Ent_03__JUMP_000.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_001.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_002.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_003.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_004.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_005.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_006.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_007.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_008.png',
        'img/enemies/_PNG/3/Ent_03__JUMP_009.png',
    ];
    IMAGES_DIE = [
        'img/enemies/_PNG/3/Ent_03__DIE_000.png',
        'img/enemies/_PNG/3/Ent_03__DIE_001.png',
        'img/enemies/_PNG/3/Ent_03__DIE_002.png',
        'img/enemies/_PNG/3/Ent_03__DIE_003.png',
        'img/enemies/_PNG/3/Ent_03__DIE_004.png',
        'img/enemies/_PNG/3/Ent_03__DIE_005.png',
        'img/enemies/_PNG/3/Ent_03__DIE_006.png',
        'img/enemies/_PNG/3/Ent_03__DIE_007.png',
        'img/enemies/_PNG/3/Ent_03__DIE_008.png',
        'img/enemies/_PNG/3/Ent_03__DIE_009.png',
    ];

    constructor() {
        super().loadImage('./img/enemies/_PNG/3/Ent_03__RUN_000.png');
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DIE);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.y = this.groundY;
        this.animate();
        this.startJumpLoop();
    }

    animate() {
        setInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.jumping) {
                this.playAnimation(this.IMAGES_JUMP);
            } else {
                this.playAnimation(this.IMAGES_RUN);
            }
        }, 100);
    }

    // Eigene, in sich geschlossene Sprungphysik - MovableObject.isAboveGround()/applyGravity()
    // sind fest auf die y-Position des Characters (y < 130) zugeschnitten und passen nicht
    // zur Bodenhoehe der halbierten Level-2-Gegner (groundY = 320).
    startJumpLoop() {
        setInterval(() => {
            if (!this.isDead() && !this.jumping) {
                this.startJump();
            }
        }, 2000 + Math.random() * 2500);

        setInterval(() => {
            if (!this.jumping) return;

            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
                this.jumping = false;
            }
        }, 1000 / 25);
    }

    startJump() {
        this.jumping = true;
        this.speedY = 22; // eine Ecke hoeher als vorher, aber noch unter dem Character
    }
}
