class MovableObject extends DrawableObject {
    speed = 0.05;
    OtherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    deathAnimationStarted = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };

    /**
     * Runs a simple gravity tick that pulls the object back down once it's above ground.
     * @returns {void}
     */
    applyGravity () {
        setInterval(() => {
            if(this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Checks whether the object currently counts as airborne. Hardcoded to the
     * character's resting y-position - not a generic "off the ground" check.
     * @returns {boolean} true while the object is above the character's ground line.
     */
    isAboveGround() {
        return this.y < 130
    }

    /**
     * Checks whether the object has reached or passed its ground line while falling,
     * and if so, snaps it back to the ground and clears its jump state. Used by the
     * level 2 enemies/endboss, which run their own self-contained jump physics instead
     * of applyGravity()/isAboveGround() (those are hardcoded to the character's y).
     * @param {number} groundY - The y position that counts as "on the ground".
     * @returns {void}
     */
    landOnGround(groundY) {
        if (this.y >= groundY) {
            this.y = groundY;
            this.speedY = 0;
            this.jumping = false;
        }
    }

    /**
     * Checks AABB collision with another object, using each object's own hitbox offset.
     * @param {MovableObject} other - The other object to test against.
     * @returns {boolean} true if the two hitboxes overlap.
     */
    isColliding(other) {
        const o1 = this.offset || { top: 0, bottom: 0, left: 0, right: 0 };
        const o2 = other.offset || { top: 0, bottom: 0, left: 0, right: 0 };

        return (
            this.x + o1.left < other.x + other.width - o2.right &&
            this.x + this.width - o1.right > other.x + o2.left &&
            this.y + o1.top < other.y + other.height - o2.bottom &&
            this.y + this.height - o1.bottom > other.y + o2.top
        );
    }

    /**
     * Applies damage to the object and records the hit time (used by isHurt()).
     * @param {number} [damage] - Amount of energy to subtract. Defaults to 5.
     * @returns {void}
     */
    hit(damage = 5) {
        this.energy -= damage;
        if(this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Checks whether the object was hit recently enough to still show the hurt state.
     * @returns {boolean} true if less than 0.5 seconds have passed since the last hit.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit; //Difference in ms
        timepassed = timepassed / 1000; // Difference in s
        return timepassed < 0.5;
    }

    /**
     * Checks whether the object's energy has reached zero.
     * @returns {boolean} true if the object is dead.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Advances and draws the current frame of the given animation.
     * @param {string[]} images - Frame paths to cycle through.
     * @param {boolean} [loop] - Whether to loop back to the first frame after the last. Defaults to true.
     * @returns {void}
     */
    playAnimation(images, loop = true){
            let i = this.currentImage % images.length;
            let path = images[i];
            this.img = this.imageCache[path];
            if (loop || this.currentImage < images.length - 1) {
                this.currentImage++;
            }
    }

    /**
     * Moves the object one step to the right, based on its current speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;
    }

    /**
     * Moves the object one step to the left, based on its current speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed || 0.05;
    }

    /**
     * Gives the object an initial upward jump velocity.
     * @returns {void}
     */
    jump() {
        this.speedY = 30;
    }

    /**
     * Plays the death animation once, freezing on the last frame afterwards.
     * @returns {void}
     */
    playDeathAnimation() {
        if (!this.deathAnimationStarted) {
            this.currentImage = 0;
            this.deathAnimationStarted = true;
        }
        this.playAnimation(this.IMAGES_DIE, false);
    }

}
