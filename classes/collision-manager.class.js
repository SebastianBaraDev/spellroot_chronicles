/**
 * Owns every per-frame check between the character and the level's enemies/items:
 * enemy contact (stomp vs. damage), collectable/potion/scroll/attack-book pickup,
 * the character's attack, and thrown-potion impacts. World creates one instance
 * per level and delegates all of this to it.
 */
class CollisionManager {
    world;

    /**
     * @param {World} world - The world this manager checks collisions for.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks the character against every enemy each tick: resolves a stomp on first
     * contact from above, otherwise damages the character (unless already hurt or
     * still within the level's spawn-protection window). Only one enemy is
     * resolved per tick, so two adjacent enemies can't both be stomped at once.
     * @returns {void}
     */
    checkCollisions() {
        const world = this.world;
        // Only resolve one enemy interaction per tick - otherwise a single jump can stomp two
        // enemies at once when they stand right next to each other and the character overlaps
        // both in the same frame.
        let handledThisFrame = false;

        world.level.enemies.forEach(enemy => {
            const isCollidingNow = world.character.isColliding(enemy);
            const wasCollidingBefore = enemy.wasColliding || false;
            enemy.wasColliding = isCollidingNow; // remember the state for the next frame

            if (!isCollidingNow) return;
            if (enemy.isDead()) return; // Skip collision if enemy is dead
            if (handledThisFrame) return;

            // Only decide on the very first contact frame whether it was a stomp - this makes
            // the detection independent of how deep the character has already "fallen into"
            // the enemy due to a large physics tick.
            if (!wasCollidingBefore && this.isStompOnEnemy(enemy)) {
                this.stompEnemy(enemy);
                handledThisFrame = true;
                return;
            }

            if (!world.character.isHurt() && !this.isSpawnProtected()) { // Only hit if the character is not already hurt and the level's grace period is over
                world.character.hit();
                world.statusBar.setPercentage(world.character.energy);
                handledThisFrame = true;
            }
        });
    }

    /**
     * Checks whether the level's start-of-level grace period is still active.
     * @returns {boolean} true if the character is still protected from enemy contact damage.
     */
    isSpawnProtected() {
        return new Date().getTime() - this.world.levelStartTime < this.world.SPAWN_PROTECTION_MS;
    }

    /**
     * Checks whether the character's feet are still above the given enemy's vertical
     * center - the condition for counting a first contact as a stomp.
     * @param {MovableObject} enemy - The enemy to test against.
     * @returns {boolean} true if this counts as a stomp.
     */
    isStompOnEnemy(enemy) {
        const characterBottom = this.world.character.getBottom();
        const enemyTop = enemy.y + enemy.offset.top;
        const enemyBottom = enemy.y + enemy.height - enemy.offset.bottom;
        const enemyCenterY = (enemyTop + enemyBottom) / 2;

        // At the moment of first contact: are the feet still above the enemy's center?
        // That's enough for a stomp - even a touch with the tip of the foot counts, as long as it comes from above.
        return characterBottom < enemyCenterY;
    }

    /**
     * Applies stomp damage to an enemy, plays the stomp sound, schedules its removal
     * if it died, and bounces the character upward.
     * @param {MovableObject} enemy - The enemy that was stomped.
     * @returns {void}
     */
    stompEnemy(enemy) {
        enemy.hit();
        this.world.sounds.playStomp();
        if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
        this.world.character.speedY = 15; // small upward bounce
    }

    /**
     * Checks the character against every crystal and collects any it's touching.
     * @returns {void}
     */
    checkCollectables() {
        this.world.level.collectableObject.forEach(crystal => {
            if (crystal.img && this.world.character.isColliding(crystal)) {
                crystal.img = null;
                this.world.collectableBar.count++;
                this.world.sounds.playCrystal();
            }
        });
    }

    /**
     * Checks the character against every potion and collects any it's touching.
     * @returns {void}
     */
    checkPotions() {
        this.world.level.potionObjects.forEach(potion => {
            if (potion.img && this.world.character.isColliding(potion)) {
                potion.img = null;
                this.world.potionBar.count++;
                this.world.sounds.playPotion();
            }
        });
    }

    /**
     * Checks the character against every scroll, healing it and collecting any it's touching.
     * @returns {void}
     */
    checkScrolls() {
        this.world.level.scrollObjects.forEach(scroll => {
            if (scroll.img && this.world.character.isColliding(scroll)) {
                scroll.img = null;
                this.world.character.energy = Math.min(this.world.character.energy + 25, 100);
                this.world.statusBar.setPercentage(this.world.character.energy);
                this.world.sounds.playScroll();
            }
        });
    }

    /**
     * Checks the character against every attack book and unlocks the attack ability
     * if it collects one.
     * @returns {void}
     */
    checkAttackBooks() {
        this.world.level.attackBookObjects.forEach(book => {
            if (book.img && this.world.character.isColliding(book)) {
                book.img = null;
                this.world.character.activateAttackAbility(10000); // unlock the attack ability for 10 seconds
                this.world.sounds.playScroll(); // same sound as picking up a scroll
            }
        });
    }

    /**
     * Called by the character when it attacks: damages every living enemy within the
     * attack radius in front of it. The radius is measured to the closest point of
     * the enemy's hitbox (not its center), so very large enemies like the level 2
     * endboss are still hit correctly.
     * @returns {void}
     */
    handleCharacterAttack() {
        const world = this.world;
        const character = world.character;
        const range = character.ATTACK_RANGE;
        const charCenterX = character.x + character.width / 2;
        const charCenterY = character.y + character.height / 2;

        world.level.enemies.forEach(enemy => {
            if (enemy.isDead()) return;

            const offset = enemy.offset || { top: 0, bottom: 0, left: 0, right: 0 };
            const enemyLeft = enemy.x + offset.left;
            const enemyRight = enemy.x + enemy.width - offset.right;
            const enemyTop = enemy.y + offset.top;
            const enemyBottom = enemy.y + enemy.height - offset.bottom;

            const closestX = Math.max(enemyLeft, Math.min(charCenterX, enemyRight));
            const closestY = Math.max(enemyTop, Math.min(charCenterY, enemyBottom));
            const distance = Math.hypot(closestX - charCenterX, closestY - charCenterY);

            const enemyCenterX = (enemyLeft + enemyRight) / 2;
            const isInFront = character.otherDirection ? enemyCenterX < charCenterX : enemyCenterX > charCenterX;

            if (distance < range && isInFront) {
                enemy.hit(10);
                if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
            }
        });

        world.sounds.playStomp();
    }

    /**
     * Checks every in-flight potion against every enemy and applies damage on impact.
     * @returns {void}
     */
    checkThrowableCollisions() {
        this.world.throwableObjects.forEach(potion => {
            this.world.level.enemies.forEach(enemy => {
                if (!potion.img || !potion.isColliding(enemy)) return;
                if (enemy.isDead()) return; // dead enemy no longer takes damage/sound

                enemy.hit();
                potion.img = null;
                this.world.sounds.playBottleCrash();
                if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
            });
        });
    }

    /**
     * Checks every in-flight endboss projectile against the character and applies
     * damage on impact. Spent or off-screen projectiles are dropped from the list.
     * @returns {void}
     */
    checkEnemyProjectileCollisions() {
        const world = this.world;

        world.enemyProjectiles.forEach(projectile => {
            if (!projectile.hasHit && world.character.isColliding(projectile)) {
                projectile.hasHit = true;
                world.character.hit(projectile.damage);
            }
        });

        world.enemyProjectiles = world.enemyProjectiles.filter(projectile => {
            const isSpent = projectile.hasHit || projectile.x < -300 || projectile.x > world.level.level_end_x + 300;
            if (isSpent) projectile.clearIntervals();
            return !isSpent;
        });
    }

    /**
     * Removes a dead enemy from the level once its death animation has finished.
     * The endboss is never removed, so its defeated pose stays visible.
     * @param {MovableObject} enemy - The enemy to remove.
     * @returns {void}
     */
    scheduleEnemyRemoval(enemy) {
        if (enemy instanceof Endboss || enemy instanceof EndbossLevel2) return; // Do not remove the endboss

        if (enemy.removalScheduled) return;
        enemy.removalScheduled = true;

        const world = this.world;
        setTimeout(() => {
            world.level.enemies = world.level.enemies.filter(e => e !== enemy);
        }, enemy.IMAGES_DIE.length * 100); // wait for the die animation to finish before removing the enemy
    }
}
