const CHARACTER_SPRITE_SETS = {
    wizard1: { folder: '1_WIZARD', prefix: 'Wizard_01' },
    wizard2: { folder: '2_WIZARD', prefix: 'Wizard_02' },
};

class Character extends MovableObject {
    height = 300;
    width = 450;
    y = 0;
    x = -50;
    speed = 5;
    otherDirection = false; // Assuming character faces right by default
    hurtSound = new Audio('audio/man-hurt.mp3');

    offset = { top: 40, bottom: 8, left: 178, right: 148 }; // adjusted to match the actual sprite silhouette
    world;
    walkingSound = new Audio('audio/running.mp3');
    jumpSound = new Audio('audio/jump.mp3');

    // Attack ability: locked by default, unlocked temporarily by collecting the attack book.
    // While active, the throw key/button (D) triggers the attack instead of throwing a potion,
    // so no extra key or mobile button is needed.
    attackAbilityEndTime = 0;
    isAttacking = false;
    ATTACK_RANGE = 220; // reach of the energy beam

    /**
     * Creates the playable character. Both playable characters have identical
     * stats/hitboxes - only the sprite set differs, selected via characterId.
     * @param {string} [characterId] - 'wizard1' or 'wizard2'. Defaults to 'wizard2'.
     */
    constructor(characterId = 'wizard2') {
        super();

        const sprite = CHARACTER_SPRITE_SETS[characterId] || CHARACTER_SPRITE_SETS.wizard2;
        const basePath = `img/wizards/PNG/${sprite.folder}/${sprite.prefix}__`;

        this.IMAGES_RUN = this.buildAnimationPaths(basePath, 'RUN');
        this.IMAGES_JUMP = this.buildAnimationPaths(basePath, 'JUMP');
        this.IMAGES_DIE = this.buildAnimationPaths(basePath, 'DIE');
        this.IMAGES_HURT = this.buildAnimationPaths(basePath, 'HURT');
        this.IMAGES_ATTACK = this.buildAnimationPaths(basePath, 'ATTACK');
        this.IMAGES_IDLE = this.buildAnimationPaths(basePath, 'IDLE');

        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_DIE);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_IDLE);
        this.applyGravity();
        this.animate();
    }

    /**
     * Builds the 10 frame paths for one animation,
     * e.g. img/wizards/PNG/1_WIZARD/Wizard_01__RUN_000.png ... _009.png.
     * @param {string} basePath - Shared path prefix up to and including the trailing double underscore.
     * @param {string} animation - Animation name, e.g. 'RUN', 'JUMP', 'IDLE'.
     * @returns {string[]} The 10 frame paths for this animation.
     */
    buildAnimationPaths(basePath, animation) {
        let paths = [];
        for (let i = 0; i < 10; i++) {
            paths.push(`${basePath}${animation}_00${i}.png`);
        }
        return paths;
    }

    /**
     * Starts the character's input/movement loop and its animation loop.
     * @returns {void}
     */
    animate() {

        setInterval(() => {
            if (this.isDead() || this.world.levelCompleteTriggered) return; // Stop movement if dead or level finished

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x -780) { // Prevent moving right beyond the level end
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > 0) { // Prevent moving left beyond the starting point
                this.moveLeft();
                this.otherDirection = true;
            }

            this.handleWalkingSound(); // Handle walking sound based on movement

            if (this.world.keyboard.UP && !this.isAboveGround()){
                this.jump();
                this.jumpSound.currentTime = 0; // Reset the jump sound to the beginning
                this.jumpSound.play();
            }

            this.checkThrow();

            this.world.camera_x = -this.x + -50; // Move the camera based on the character's position
        }, 1000 / 60); // Run at 60 FPS

        setInterval(() => {
            if (this.world.levelCompleteTriggered) return; // freeze the last frame once the level is complete

            if(this.isDead()){
                this.playDeathAnimation();
            } else if(this.isAttacking) {
                this.playAnimation(this.IMAGES_ATTACK, false);
            } else if(this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if(this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMP);
            } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.IMAGES_RUN); // Play running animation when moving left or right
            } else {
                this.playAnimation(this.IMAGES_IDLE); // Standing still - play the idle animation
            }
        }, 50);
    }

    /**
     * Plays or pauses the walking sound depending on whether the character is
     * currently moving on the ground.
     * @returns {void}
     */
    handleWalkingSound() {
        const isMoving = this.world.keyboard.RIGHT || this.world.keyboard.LEFT;

        if (isMoving && !this.isAboveGround()) {
            this.walkingSound.play();
        } else {
            this.walkingSound.pause();
        }
    }

    /**
     * Handles the throw/attack key (D): performs an attack if the attack ability
     * is currently active, otherwise throws a potion.
     * @returns {void}
     */
    checkThrow() {
        if (this.world.keyboard.D && this.canThrow()) {
            if (this.hasAttackAbility()) {
                this.performAttack();
            } else {
                this.world.throwPotion();
            }
            this.lastThrow = new Date().getTime();
        }
    }

    /**
     * Checks whether enough time has passed since the last throw/attack.
     * @returns {boolean} true if the 0.5 second cooldown has elapsed.
     */
    canThrow() {
        let timePassed = new Date().getTime() - (this.lastThrow || 0);
        return timePassed > 500; // 0.5 second cooldown between throws/attacks
    }

    /**
     * Unlocks the attack ability for the given duration (called when the attack book is collected).
     * @param {number} [durationMs] - How long the ability stays active, in milliseconds. Defaults to 7000.
     * @returns {void}
     */
    activateAttackAbility(durationMs = 7000) {
        this.attackAbilityEndTime = new Date().getTime() + durationMs;
    }

    /**
     * Checks whether the attack ability is currently unlocked.
     * @returns {boolean} true if the attack ability's active window hasn't expired yet.
     */
    hasAttackAbility() {
        return new Date().getTime() < this.attackAbilityEndTime;
    }

    /**
     * Plays the attack animation and damages nearby enemies via the world.
     * @returns {void}
     */
    performAttack() {
        // Cancel a still-running timeout from a previous attack, otherwise it would turn
        // isAttacking off mid-way through this new attack and cut the animation (and the
        // energy ball frame) short before it finishes playing.
        if (this.attackTimeoutId) clearTimeout(this.attackTimeoutId);

        this.isAttacking = true;
        this.currentImage = 0;
        this.world.handleCharacterAttack();

        this.attackTimeoutId = setTimeout(() => {
            this.isAttacking = false;
        }, this.IMAGES_ATTACK.length * 80);
    }

    /**
     * Applies a hit (characters take more damage than standard enemies) and plays the hurt sound.
     * @returns {void}
     */
    hit() {
        super.hit(10); // character takes more damage than the standard enemies
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
    }

    /**
     * Computes the character's current bottom edge (feet), accounting for its hitbox offset.
     * @returns {number} Y coordinate of the character's feet.
     */
    getBottom() {
        return this.y + this.height - this.offset.bottom;
    }

}
