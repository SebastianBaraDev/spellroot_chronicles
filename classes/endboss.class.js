class Endboss extends MovableObject {
    otherDirection = true;
    energy = 25; // 5 hits with a potion needed (5 damage each)
    footstepsSound = new Audio('audio/monster-footsteps.mp3');
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

    /**
     * Creates the level 1 endboss at the far end of the level and starts its
     * animation, proximity-speed check and ranged attack loop.
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
        this.footstepsSound.loop = true; // Set the footsteps sound to loop
        this.footstepsSound.volume = 0.3; // Set the volume to 30%
    }

    /**
     * Starts the endboss's movement loop, its walk/hurt/death animation loop, its
     * proximity-speed check and its footsteps sound loop.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            if (!this.isDead()) this.moveLeft();
        }, 1000 / 60);

        this.registerInterval(() => {
            if (this.isDead()) {this.playDeathAnimation();
            } else if (this.isHurt()) {this.playAnimation(this.IMAGES_HURT);
            } else { this.playAnimation(this.IMAGES_WALK);}
        }, 150);

        this.registerInterval(() => this.handleFootstepsSound(), 300);
        this.registerInterval(() => this.updateSpeedFromProximity(), 200);
    }

    /**
     * Speeds the endboss up into a charge once the character comes within
     * CHARGE_RANGE, so it can no longer just be out-walked at a safe distance.
     * @returns {void}
     */
    updateSpeedFromProximity() {
        if (!this.world || this.isDead()) return;

        const distance = Math.abs(this.world.character.x - this.x);
        this.speed = distance < this.CHARGE_RANGE ? this.CHARGE_SPEED : this.BASE_SPEED;
    }

    /**
     * Periodically fires a ranged energy projectile at the character while it's
     * within shooting range, so the endboss can't be safely potion-spammed from
     * a distance without any counter-threat.
     * @returns {void}
     */
    startShootLoop() {
        this.registerInterval(() => {
            if (!this.world || this.isDead()) return;

            const distance = Math.abs(this.world.character.x - this.x);
            if (distance < this.SHOOT_MIN_RANGE || distance > this.SHOOT_MAX_RANGE) return;

            const direction = this.world.character.x < this.x ? -1 : 1;
            this.world.spawnEnemyProjectile(this.x + this.width / 2, this.y + this.height / 2, direction, 10);
        }, 2500 + Math.random() * 1500);
    }

    /**
     * Plays or pauses the footsteps sound depending on whether the endboss is
     * currently visible on screen and still alive.
     * @returns {void}
     */
    handleFootstepsSound() {
        if (!this.world) return; // world is not set yet at the start

        if (this.isDead()) {
            this.footstepsSound.pause();
            return;
        }

        const isVisible = this.x + this.width > -this.world.camera_x
            && this.x < -this.world.camera_x + this.world.canvas.width;

        isVisible ? this.footstepsSound.play() : this.footstepsSound.pause();
    }

    /**
     * Applies a hit and plays the endboss's growl sound.
     * @returns {void}
     */
    hit() {
        super.hit();
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
    }
}
