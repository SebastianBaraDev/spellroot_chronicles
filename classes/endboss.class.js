class Endboss extends EndbossBase {
    energy = 25; // 5 hits with a potion needed (5 damage each)
    hurtSound = new Audio('audio/deep-growl.mp3');
    offset = { top: 30, bottom: 15, left: 248, right: 230 }; // adjusted to match the actual sprite silhouette

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

    BASE_SPEED = 0.1;
    CHARGE_SPEED = 0.45; // faster pursuit once the character gets close
    CHARGE_RANGE = 400; // distance at which the endboss starts charging
    SHOOT_MIN_RANGE = 180; // doesn't shoot at point-blank range - contact damage covers that
    SHOOT_MAX_RANGE = 750;
    MELEE_THROW_MIN_RANGE = 40; // just outside contact range
    MELEE_THROW_MAX_RANGE = 180; // up to where the ranged shot takes over (SHOOT_MIN_RANGE)

    /**
     * Creates the level 1 endboss at the far end of the level and starts its
     * animation, proximity-speed check and ranged/melee attack loops.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
        this.x = 4338; // moved further back (level extended by one more segment)
        this.y = -40;
        this.speed = this.BASE_SPEED;
        this.height = 500;
        this.width = 700;
        this.animate();
        this.startShootLoop();
        this.startMeleeThrowLoop();
        this.startSightCheckLoop();
        this.footstepsSound.loop = true; // Set the footsteps sound to loop
        this.footstepsSound.volume = 0.3; // Set the volume to 30%
    }

    /**
     * Starts the endboss's movement loop (turning to face and chase the character),
     * its walk/hurt/death animation loop, its proximity-speed check and its
     * footsteps sound loop.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            if (!this.isDead()) this.moveTowardsCharacter();
        }, 1000 / 60);

        this.registerInterval(() => {
            if (this.isDead()) {this.playDeathAnimation();
            } else if (this.isHurt()) {this.playAnimation(this.IMAGES_HURT);
            } else { this.playAnimation(this.IMAGES_WALK);}
        }, 150);

        this.registerInterval(() => this.handleFootstepsSound(), 300);
        this.registerInterval(() => this.updateSpeedFromProximity(), 200);
    }
}
