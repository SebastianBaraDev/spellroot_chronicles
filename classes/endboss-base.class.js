/**
 * Shared behavior for both endbosses (level 1's Ent guardian and level 2's ork
 * warlord): proximity-based charge speed, turning to face and chase the character,
 * the ranged energy-ball shot, the close-range bluish throw, footsteps sound
 * handling, and the hit-with-growl reaction. Subclasses only add what's actually
 * different between them: sprites/size, timings/ranges, and (for level 2 only)
 * the jump/attack states.
 */
class EndbossBase extends MovableObject {
    otherDirection = true;
    jumping = false; // level 1 never sets this true - keeping the field here lets every
                      // guard below work unmodified for both subclasses
    attacking = false; // same idea - only actually toggled by EndbossLevel2's attack loop

    footstepsSound = new Audio('audio/monster-footsteps.mp3'); // identical for both bosses; hurtSound differs per subclass
    laughSound = new Audio('audio/demon-laugh.mp3'); // identical for both bosses; played once when the character first comes into view
    chargeShotSound = new Audio('audio/energy-beam-blast.mp3'); // ~3s: ~2s charge-up hum, last ~1s is the actual blast
    hasSpottedCharacter = false;
    FOOTSTEPS_MAX_RATE = 1.8; // caps how much faster the footsteps sound plays back while charging, so it speeds up but doesn't turn into a chipmunk

    // Default ranged-attack/melee-throw timing - EndbossLevel2 overrides these to be slightly slower.
    SHOOT_INTERVAL_MS = 2500;
    SHOOT_INTERVAL_JITTER_MS = 1500;
    MELEE_THROW_INTERVAL_MS = 2000;
    MELEE_THROW_INTERVAL_JITTER_MS = 1500;
    SHOOT_CHARGE_MS = 2000; // matches the charge-up portion of chargeShotSound - the projectile only spawns once this elapses
    chargingShot = false; // true while the charge-up sound is playing, so the shot can't be re-triggered mid-charge

    /**
     * Turns to face the character and moves towards it. Without this, an endboss
     * that the character has run past would just keep walking in its original
     * direction forever instead of turning around and giving chase.
     * @returns {void}
     */
    moveTowardsCharacter() {
        if (!this.world) return;

        const movingRight = this.world.character.x > this.x;
        this.otherDirection = !movingRight; // sprite's un-flipped art faces right, so facing left needs the flip

        if (movingRight) {
            this.moveRight();
        } else {
            this.moveLeft();
        }
    }

    /**
     * Speeds the endboss up into a charge once the character comes within
     * CHARGE_RANGE, so it can no longer just be out-walked at a safe distance.
     * @returns {void}
     */
    updateSpeedFromProximity() {
        if (!this.world || this.isDead() || this.jumping || this.attacking) return;

        const distance = Math.abs(this.world.character.x - this.x);
        this.speed = distance < this.CHARGE_RANGE ? this.CHARGE_SPEED : this.BASE_SPEED;
    }

    /**
     * Computes the vertical center of the character's actual collision hitbox
     * (its offset-adjusted box, not its raw sprite bounding box). Ranged shots and
     * melee throws aim at this instead of the endboss's own (much bigger) bounding-box
     * center, so tall bosses like the level 2 ork don't fire straight over the
     * character's head just because their own sprite is proportionally huge.
     * @returns {number} Y coordinate of the character hitbox's vertical center.
     */
    getCharacterHitboxCenterY() {
        const character = this.world.character;
        const offset = character.offset;
        return character.y + offset.top + (character.height - offset.top - offset.bottom) / 2;
    }

    /**
     * Periodically fires a ranged energy projectile at the character while it's
     * within shooting range, so the endboss can't be safely potion-spammed from
     * a distance without any counter-threat.
     * @returns {void}
     */
    startShootLoop() {
        this.registerInterval(() => {
            if (!this.world || this.isDead() || this.jumping || this.attacking || this.chargingShot) return;

            const distance = Math.abs(this.world.character.x - this.x);
            if (distance < this.SHOOT_MIN_RANGE || distance > this.SHOOT_MAX_RANGE) return;

            this.chargingShot = true;
            this.chargeShotSound.currentTime = 0;
            this.chargeShotSound.play();

            setTimeout(() => {
                this.chargingShot = false;
                if (!this.world || this.isDead()) return; // boss died mid charge-up - no shot fires

                const currentDistance = Math.abs(this.world.character.x - this.x);
                if (currentDistance < this.SHOOT_MIN_RANGE || currentDistance > this.SHOOT_MAX_RANGE) return; // character left range while charging

                const direction = this.world.character.x < this.x ? -1 : 1;
                const targetY = this.getCharacterHitboxCenterY() - 20; // 20 = half of EnemyProjectile's 40px size, so its center lands on the target
                this.world.spawnEnemyProjectile(this.x + this.width / 2 - 20, targetY, direction, 10);
            }, this.SHOOT_CHARGE_MS); // fires right as the blast portion of chargeShotSound plays
        }, this.SHOOT_INTERVAL_MS + Math.random() * this.SHOOT_INTERVAL_JITTER_MS);
    }

    /**
     * Periodically lobs a bluish close-range throwable at the character (same arc-throw
     * physics as the character's own potions) while it's too close for the ranged shot
     * but not in direct contact, so getting in close doesn't make the endboss harmless
     * from a distance-attack point of view.
     * @returns {void}
     */
    startMeleeThrowLoop() {
        this.registerInterval(() => {
            if (!this.world || this.isDead() || this.jumping || this.attacking) return;

            const distance = Math.abs(this.world.character.x - this.x);
            if (distance < this.MELEE_THROW_MIN_RANGE || distance > this.MELEE_THROW_MAX_RANGE) return;

            const direction = this.world.character.x < this.x ? -1 : 1;
            const targetY = this.getCharacterHitboxCenterY() - 17; // 17 = half of EnemyThrowable's 34px size, so its center lands on the target
            this.world.spawnEnemyThrowable(this.x + this.width / 2 - 17, targetY, direction, 8);
        }, this.MELEE_THROW_INTERVAL_MS + Math.random() * this.MELEE_THROW_INTERVAL_JITTER_MS);
    }

    /**
     * Watches for the character coming within the endboss's sight range (reusing
     * SHOOT_MAX_RANGE, the outer edge of its engagement distance) and plays a
     * one-shot demonic laugh the first time that happens, as an "I see you" cue.
     * @returns {void}
     */
    startSightCheckLoop() {
        this.registerInterval(() => {
            if (!this.world || this.isDead() || this.hasSpottedCharacter) return;

            const distance = Math.abs(this.world.character.x - this.x);
            if (distance > this.SHOOT_MAX_RANGE) return;

            this.hasSpottedCharacter = true;
            this.laughSound.currentTime = 0;
            this.laughSound.play();
        }, 300);
    }

    /**
     * Plays or pauses the footsteps sound depending on whether the endboss is
     * currently visible on screen and still alive, and speeds up its playback
     * rate while charging so faster footwork actually sounds faster too.
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

        if (isVisible) {
            const speedRatio = this.speed / this.BASE_SPEED;
            this.footstepsSound.playbackRate = Math.min(speedRatio, this.FOOTSTEPS_MAX_RATE);
            this.footstepsSound.play();
        } else {
            this.footstepsSound.pause();
        }
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
