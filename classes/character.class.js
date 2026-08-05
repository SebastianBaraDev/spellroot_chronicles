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

    // Sleep idle: after IDLE_TO_SLEEP_MS without any input, the character dozes off.
    // Reuses one frozen IDLE frame (no separate sprite needed) - the "asleep" look comes
    // from a code-drawn head nod plus floating Zs and a breathing bubble. All coordinates
    // below are in local sprite-box pixels (0,0 = top-left of the 450x300 character box) -
    // tweak these numbers directly to reposition/resize/retime the effect.
    lastActionTime = new Date().getTime();
    IDLE_TO_SLEEP_MS = 7000;

    SLEEP_HEAD_X = 225; // horizontal anchor for the Z's/bubble - roughly the head's center
    SLEEP_HEAD_TOP_Y = 110; // vertical anchor - roughly where the hood/head actually starts (NOT offset.top, that's the hitbox)
    SLEEP_BUBBLE_OFFSET_X = 15; // bubble position relative to SLEEP_HEAD_X (towards the mouth)
    SLEEP_BUBBLE_OFFSET_Y = 55; // bubble position relative to SLEEP_HEAD_TOP_Y (down towards the mouth)
    SLEEP_Z_OFFSET_X = 20; // Z letters' starting position relative to SLEEP_HEAD_X
    SLEEP_Z_OFFSET_Y = 0; // Z letters' starting position relative to SLEEP_HEAD_TOP_Y

    SLEEP_NOD_PIVOT_Y = 195; // rotation pivot, roughly shoulder height - only the head above this line visibly swings
    SLEEP_NOD_AMPLITUDE_DEG = 2; // how far the head tilts side to side, in degrees
    SLEEP_NOD_PERIOD_MS = 4500; // how long one full nod cycle takes - bigger = slower/calmer

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
        this.IMAGES_SLEEP = this.IMAGES_IDLE; // no separate art - sleep look is drawn in code on top of these

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

        this.registerInterval(() => {
            if (this.isDead() || this.world.levelCompleteTriggered) return; // Stop movement if dead or level finished

            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.UP || this.world.keyboard.D) {
                this.lastActionTime = new Date().getTime(); // any input postpones the sleep idle
            }

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

        this.registerInterval(() => {
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
            } else if (this.isSleeping()) {
                this.img = this.imageCache[this.IMAGES_SLEEP[0]]; // frozen on one idle frame - only the head-nod overlay moves
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

    /**
     * Checks whether the character has been idle (no movement/jump/throw input) for
     * long enough to doze off, and isn't currently in a state that should override
     * that (dead, hurt, attacking, airborne or actively moving).
     * @returns {boolean} true if the sleep idle should be shown.
     */
    isSleeping() {
        if (this.isDead() || this.isHurt() || this.isAttacking || this.isAboveGround()) return false;
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) return false;

        return new Date().getTime() - this.lastActionTime > this.IDLE_TO_SLEEP_MS;
    }

    /**
     * Draws the character's current frame. While asleep, the (frozen) sprite is
     * rotated a couple of degrees back and forth around SLEEP_NOD_PIVOT_Y (roughly
     * shoulder height), so only the head above that line visibly nods - the body/arms
     * near and below the pivot barely move.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.isSleeping()) {
            super.draw(ctx);
            return;
        }

        const t = new Date().getTime() / this.SLEEP_NOD_PERIOD_MS;
        const angleDeg = Math.sin(t * Math.PI * 2) * this.SLEEP_NOD_AMPLITUDE_DEG;
        const angleRad = angleDeg * (Math.PI / 180);
        const pivotX = this.width / 2;
        const pivotY = this.SLEEP_NOD_PIVOT_Y;

        ctx.save();
        if (this.otherDirection) {
            ctx.translate(pivotX, pivotY);
        } else {
            ctx.translate(this.x + pivotX, this.y + pivotY);
        }
        ctx.rotate(angleRad);
        ctx.drawImage(this.img, -pivotX, -pivotY, this.width, this.height);
        ctx.restore();
    }

    /**
     * Draws small floating "Z" letters and a growing/shrinking breathing bubble
     * near the character's head while asleep, positioned via SLEEP_HEAD_X/
     * SLEEP_HEAD_TOP_Y and the SLEEP_*_OFFSET_* constants above. Called after the
     * camera-flip transform has been undone, so the effect is always upright and
     * never mirrored.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    drawFrame(ctx) {
        super.drawFrame(ctx); // keeps the debug hitbox overlay (H key) working

        if (!this.isSleeping()) return;

        const t = new Date().getTime() / 1000;
        const headX = this.x + this.SLEEP_HEAD_X;
        const headTopY = this.y + this.SLEEP_HEAD_TOP_Y;

        this.drawSleepBubble(ctx, headX + this.SLEEP_BUBBLE_OFFSET_X, headTopY + this.SLEEP_BUBBLE_OFFSET_Y, t);
        this.drawSleepZs(ctx, headX + this.SLEEP_Z_OFFSET_X, headTopY + this.SLEEP_Z_OFFSET_Y, t);
    }

    /**
     * Draws a small breathing bubble near the mouth that grows and shrinks over time.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @param {number} x - Bubble center X.
     * @param {number} y - Bubble center Y.
     * @param {number} t - Current time in seconds, used to animate the size.
     * @returns {void}
     */
    drawSleepBubble(ctx, x, y, t) {
        const radius = 6 + Math.sin(t * 2.2) * 3.5;

        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#bfe6ff';
        ctx.strokeStyle = '#5aa9d6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws three "Z" letters that float upward and fade out on a staggered loop.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @param {number} x - Anchor X, roughly above the character's head.
     * @param {number} y - Anchor Y, roughly at the top of the character's head.
     * @param {number} t - Current time in seconds, used to animate the float/fade.
     * @returns {void}
     */
    drawSleepZs(ctx, x, y, t) {
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        [0, 1, 2].forEach(i => {
            const cycle = 1.5; // seconds per loop, staggered per letter
            const phase = (t * 0.8 + i * (cycle / 3)) % cycle;
            const progress = phase / cycle;

            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - progress);
            ctx.font = `bold ${14 + i * 4}px Arial, sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#2a3d66';
            ctx.lineWidth = 2;
            ctx.translate(x + i * 12, y - progress * 45);
            ctx.strokeText('Z', 0, 0);
            ctx.fillText('Z', 0, 0);
            ctx.restore();
        });

        ctx.restore();
    }

}
