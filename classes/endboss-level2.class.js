class EndbossLevel2 extends EndbossBase {
    energy = 60; // 12 hits with a potion needed (5 damage each)
    hurtSound = new Audio('audio/dragon-growl.mp3');
    offset = { top: 46, bottom: 20, left: 296, right: 257 }; // scaled proportionally to the larger sprite output

    groundY = -170; // 20px lower than before
    y = -170;
    speedY = 0;

    IMAGES_WALK = [
        'img/enemies/3_ORK/ORK_03_WALK_000.png',
        'img/enemies/3_ORK/ORK_03_WALK_001.png',
        'img/enemies/3_ORK/ORK_03_WALK_002.png',
        'img/enemies/3_ORK/ORK_03_WALK_003.png',
        'img/enemies/3_ORK/ORK_03_WALK_004.png',
        'img/enemies/3_ORK/ORK_03_WALK_005.png',
        'img/enemies/3_ORK/ORK_03_WALK_006.png',
        'img/enemies/3_ORK/ORK_03_WALK_007.png',
        'img/enemies/3_ORK/ORK_03_WALK_008.png',
        'img/enemies/3_ORK/ORK_03_WALK_009.png',
    ];
    IMAGES_JUMP = [
        'img/enemies/3_ORK/ORK_03_JUMP_000.png',
        'img/enemies/3_ORK/ORK_03_JUMP_001.png',
        'img/enemies/3_ORK/ORK_03_JUMP_002.png',
        'img/enemies/3_ORK/ORK_03_JUMP_003.png',
        'img/enemies/3_ORK/ORK_03_JUMP_004.png',
        'img/enemies/3_ORK/ORK_03_JUMP_005.png',
        'img/enemies/3_ORK/ORK_03_JUMP_006.png',
        'img/enemies/3_ORK/ORK_03_JUMP_007.png',
        'img/enemies/3_ORK/ORK_03_JUMP_008.png',
        'img/enemies/3_ORK/ORK_03_JUMP_009.png',
    ];
    IMAGES_ATTACK = [
        'img/enemies/3_ORK/ORK_03_ATTAK_000.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_001.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_002.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_003.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_004.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_005.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_006.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_007.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_008.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_009.png',
    ];
    IMAGES_HURT = [
        'img/enemies/3_ORK/ORK_03_HURT_000.png',
        'img/enemies/3_ORK/ORK_03_HURT_001.png',
        'img/enemies/3_ORK/ORK_03_HURT_002.png',
        'img/enemies/3_ORK/ORK_03_HURT_003.png',
        'img/enemies/3_ORK/ORK_03_HURT_004.png',
        'img/enemies/3_ORK/ORK_03_HURT_005.png',
        'img/enemies/3_ORK/ORK_03_HURT_006.png',
        'img/enemies/3_ORK/ORK_03_HURT_007.png',
        'img/enemies/3_ORK/ORK_03_HURT_008.png',
        'img/enemies/3_ORK/ORK_03_HURT_009.png',
    ];
    IMAGES_DIE = [
        'img/enemies/3_ORK/ORK_03_DIE_000.png',
        'img/enemies/3_ORK/ORK_03_DIE_001.png',
        'img/enemies/3_ORK/ORK_03_DIE_002.png',
        'img/enemies/3_ORK/ORK_03_DIE_003.png',
        'img/enemies/3_ORK/ORK_03_DIE_004.png',
        'img/enemies/3_ORK/ORK_03_DIE_005.png',
        'img/enemies/3_ORK/ORK_03_DIE_006.png',
        'img/enemies/3_ORK/ORK_03_DIE_007.png',
        'img/enemies/3_ORK/ORK_03_DIE_008.png',
        'img/enemies/3_ORK/ORK_03_DIE_009.png',
    ];

    BASE_SPEED = 0.1;
    CHARGE_SPEED = 0.4;
    CHARGE_RANGE = 450;
    SHOOT_MIN_RANGE = 200;
    SHOOT_MAX_RANGE = 800;
    MELEE_THROW_MIN_RANGE = 50; // just outside contact range
    MELEE_THROW_MAX_RANGE = 200; // up to where the ranged shot takes over (SHOOT_MIN_RANGE)
    SHOOT_INTERVAL_MS = 3000; // slightly slower cadence than level 1's endboss
    SHOOT_INTERVAL_JITTER_MS = 2000;
    MELEE_THROW_INTERVAL_MS = 2500;

    /**
     * Creates the level 2 endboss at the far end of the level and starts its animation,
     * jump loop, attack loop, proximity-speed check and ranged/melee attack loops.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
        this.x = 4338;
        this.y = this.groundY;
        this.speed = this.BASE_SPEED;
        this.height = 650;
        this.width = 900;
        this.animate();
        this.startJumpLoop();
        this.startAttackLoop();
        this.startShootLoop();
        this.startMeleeThrowLoop();
        this.startSightCheckLoop();
        this.footstepsSound.loop = true;
        this.footstepsSound.volume = 0.3;
    }

    /**
     * Starts the endboss's movement loop (turning to face and chase the character,
     * paused during an axe swing), its walk/jump/attack/hurt/death animation loop,
     * its proximity-speed check and its footsteps sound loop.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            if (!this.isDead() && !this.attacking) this.moveTowardsCharacter();
        }, 1000 / 60);

        this.registerInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.attacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.jumping) {
                this.playAnimation(this.IMAGES_JUMP);
            } else {
                this.playAnimation(this.IMAGES_WALK);
            }
        }, 150);

        this.registerInterval(() => this.handleFootstepsSound(), 300);
        this.registerInterval(() => this.updateSpeedFromProximity(), 200);
    }

    /**
     * Runs the endboss's own self-contained jump physics loop (smaller jump force
     * than the regular level 2 enemy) - not built on
     * MovableObject.isAboveGround()/applyGravity(), for the same reasons as EnemieLevel2.
     * @returns {void}
     */
    startJumpLoop() {
        this.registerInterval(() => {
            if (!this.isDead() && !this.jumping && !this.attacking) {
                this.startJump();
            }
        }, 3500 + Math.random() * 3000);

        this.registerInterval(() => {
            if (!this.jumping) return;

            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            this.landOnGround(this.groundY);
        }, 1000 / 25);
    }

    /**
     * Kicks off a single small jump by giving the endboss an initial upward velocity.
     * @returns {void}
     */
    startJump() {
        this.jumping = true;
        this.speedY = 8; // small jump
    }

    /**
     * Runs the periodic axe attack mode: movement pauses during the attack
     * animation so the axe swing looks believable.
     * @returns {void}
     */
    startAttackLoop() {
        this.registerInterval(() => {
            if (!this.isDead() && !this.attacking && !this.jumping) {
                this.attacking = true;
                this.currentImage = 0;
                setTimeout(() => {
                    this.attacking = false;
                }, this.IMAGES_ATTACK.length * 150);
            }
        }, 4000 + Math.random() * 3000);
    }
}
