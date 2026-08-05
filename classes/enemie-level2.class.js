class EnemieLevel2 extends MovableObject {
    height = 120;
    width = 200;
    groundY = 310; // ground line, adjusted to 2/3 size (same footprint as level 1 enemies)
    y = 310;
    otherDirection = true;
    energy = 5;
    speedY = 0;
    jumping = false;
    offset = { top: 12, bottom: 4, left: 65, right: 59 }; // scaled proportionally (2/3) from the level 1 offset

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

    /**
     * Creates a halved-size level 2 enemy at a random position/speed and starts its
     * movement and periodic jump behavior.
     */
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

    /**
     * Starts the enemy's movement loop and its run/jump/death animation loop.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);

        this.registerInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.jumping) {
                this.playAnimation(this.IMAGES_JUMP);
            } else {
                this.playAnimation(this.IMAGES_RUN);
            }
        }, 100);
    }

    /**
     * Runs the enemy's own self-contained jump physics loop. Not built on
     * MovableObject.isAboveGround()/applyGravity(), since those are hardcoded to the
     * character's y-position (y < 130) and don't match this enemy's ground line.
     * @returns {void}
     */
    startJumpLoop() {
        this.registerInterval(() => {
            if (!this.isDead() && !this.jumping) {
                this.startJump();
            }
        }, 2000 + Math.random() * 2500);

        this.registerInterval(() => {
            if (!this.jumping) return;

            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            this.landOnGround(this.groundY);
        }, 1000 / 25);
    }

    /**
     * Kicks off a single jump by giving the enemy an initial upward velocity.
     * @returns {void}
     */
    startJump() {
        this.jumping = true;
        this.speedY = 22; // a bit higher than before, but still below the character
    }
}
