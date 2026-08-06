class World {
    character;
    level;
    statusBar = new StatusBar();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    enemyProjectiles = [];
    enemyThrowables = [];
    collectableBar = new CollectableBar();
    potionBar = new PotionBar();
    sounds = new SoundManager();
    collisions = new CollisionManager(this);
    gameOverTriggered = false;
    replayButtonImage = new Image();
    replayButton = null;
    levelCompleteTriggered = false;
    nextLevelSignImage = new Image();
    nextLevelSign = null;
    stopped = false;
    isLastLevel = false;
    levelStartTime = new Date().getTime();
    SPAWN_PROTECTION_MS = 1500; // grace period at the start of every level - the character can't take damage yet

    /**
     * Builds the game world for one level: creates the character, HUD buttons and
     * sounds, wires up the level's objects, then starts the render loop and
     * collision-check intervals.
     * @param {HTMLCanvasElement} canvas - The game canvas to render into.
     * @param {Keyboard} keyboard - The shared keyboard input state.
     * @param {Level} level - The level to play (must be freshly built, e.g. via createLevel1()/createLevel2()).
     * @param {boolean} [isLastLevel] - Whether completing this level should show "THE END" instead of a next-level sign. Defaults to false.
     * @param {string} [characterId] - Which playable character sprite set to use. Defaults to 'wizard2'.
     */
    constructor(canvas, keyboard, level, isLastLevel = false, characterId = 'wizard2') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level;
        this.isLastLevel = isLastLevel;
        this.character = new Character(characterId);
        this.replayButtonImage.src = 'img/replay-btn.png';
        this.nextLevelSignImage.src = 'img/btn-next-level.png';
        this.soundButton = new SoundButton(this.canvas.width, (isMuted) => this.applyMuteToAllSounds(isMuted));
        this.applyMuteToAllSounds(this.soundButton.isMuted); // apply the persisted mute preference right away, not just on the next toggle
        this.fullscreenButton = new FullscreenButton(this.canvas.width, this.canvas.height, () => toggleFullscreen());
        this.homeButton = new HomeButton(this.canvas.width, () => goToHomescreen());
        this.pauseButton = new PauseButton(this.canvas.width, (isPaused) => this.applyPauseState(isPaused));
        this.draw();
        this.setWorld();
        this.run();
        this.sounds.startBackgroundMusic();
        this.setupSoundButtonClick();
    }

    /**
     * Backreferences this World onto the character and every enemy, so they can
     * read shared state (keyboard, camera, other objects) without it being passed around.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Renders one full frame: background, game objects, HUD, and either the
     * game-over or level-complete overlay if applicable. Reschedules itself via
     * requestAnimationFrame until stop() is called.
     * @returns {void}
     */
    draw() {
        if (this.stopped) return; // stop drawing the old World object after a level change

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing

        this.drawLevelObjects();
        this.drawHUD();
        this.checkGameEndState();

        if (!this.stopped) {
            requestAnimationFrame(() => this.draw()); // Call draw again on the next frame
        }
    }

    /**
     * Draws every camera-relative object for the current frame: background, clouds,
     * pickups, enemies, throwables and the character. Restores the camera transform afterwards.
     * @returns {void}
     */
    drawLevelObjects() {
        this.ctx.translate(this.camera_x, 0); // Move the camera

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);

        // Draw collectable objects first, so that enemies appear behind them (not in front)
        this.addObjectToMap(this.level.collectableObject);
        this.addObjectToMap(this.level.potionObjects);
        this.addObjectToMap(this.level.scrollObjects);
        this.addObjectToMap(this.level.attackBookObjects);

        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);
        this.addObjectToMap(this.enemyProjectiles);
        this.addObjectToMap(this.enemyThrowables);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Move the camera back to the original position
    }

    /**
     * Draws the fixed-on-screen HUD: status bar, item bars, and the sound/home/fullscreen buttons.
     * @returns {void}
     */
    drawHUD() {
        this.addToMap(this.statusBar); // Statusbar fixed on screen (outside camera translate)
        this.addToMap(this.collectableBar); // Collectable bar fixed on screen (outside camera translate)
        this.addToMap(this.potionBar);
        this.addToMap(this.soundButton);
        this.addToMap(this.homeButton);
        this.addToMap(this.pauseButton);
        if (!isMobileLayout()) {
            this.addToMap(this.fullscreenButton); // on mobile the fullscreen button is not displayed, so it doesn't need to be drawn
        }
    }

    /**
     * Checks whether the character or the endboss has died this frame, and if so
     * draws the corresponding Game Over / level-complete overlay.
     * @returns {void}
     */
    checkGameEndState() {
        if (this.character.isDead()) {
            this.handleGameOver();
        } else if (this.getEndboss()?.isDead()) {
            this.handleLevelComplete();
        }
    }

    /**
     * Finds the endboss (level 1 or level 2 variant) among this level's enemies.
     * @returns {(Endboss|EndbossLevel2|undefined)} The endboss, or undefined if not found.
     */
    getEndboss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss || enemy instanceof EndbossLevel2);
    }

    /**
     * Draws the Game Over screen and replay button, playing the game-over sound once.
     * @returns {void}
     */
    handleGameOver() {
        if (!this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.sounds.playGameOver();
        }

        this.ctx.font = '64px Roots';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);

        this.drawReplayButton(this.canvas.height / 2 + 40);
    }

    /**
     * Draws the (inverted) replay button centered horizontally at the given y position
     * and remembers its bounds for click/hover detection. Shared by the Game Over
     * screen and the "THE END" screen.
     * @param {number} y - Top y position to draw the button at.
     * @returns {void}
     */
    drawReplayButton(y) {
        const buttonSize = 80;
        this.replayButton = {
            x: this.canvas.width / 2 - buttonSize / 2,
            y: y,
            width: buttonSize,
            height: buttonSize,
        };
        this.ctx.filter = 'invert(1)';
        this.ctx.drawImage(this.replayButtonImage, this.replayButton.x, this.replayButton.y, buttonSize, buttonSize);
        this.ctx.filter = 'none';
    }

    /**
     * Checks whether the given canvas coordinates are over the replay button (visible on
     * Game Over, and on the "THE END" screen after beating the last level).
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {boolean} true if the point is inside the replay button's bounds.
     */
    isReplayButtonHovered(mouseX, mouseY) {
        const isReplayVisible = this.character.isDead() || (this.isLastLevel && this.getEndboss()?.isDead());
        if (!isReplayVisible || !this.replayButton) return false;

        return mouseX >= this.replayButton.x && mouseX <= this.replayButton.x + this.replayButton.width
            && mouseY >= this.replayButton.y && mouseY <= this.replayButton.y + this.replayButton.height;
    }

    /**
     * Handles a click on the replay button: on "THE END" it returns to the start
     * screen; on Game Over it restarts the level the character just died in, right
     * from the beginning, with a completely fresh set of enemies/items.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    handleReplayButtonClick(mouseX, mouseY) {
        if (!this.isReplayButtonHovered(mouseX, mouseY)) return;

        if (this.isLastLevel && this.getEndboss()?.isDead()) {
            goToHomescreen(); // in game.js: "THE END" -> back to the start screen
        } else {
            restartGame(); // in game.js: Game Over -> restart the current level from scratch
        }
    }

    /**
     * Draws the level-complete overlay: "THE END" on the last level, otherwise
     * "LEVEL DONE" plus a clickable next-level sign. Plays the win sound once.
     * @returns {void}
     */
    handleLevelComplete() {
        if (!this.levelCompleteTriggered) {
            this.levelCompleteTriggered = true;
            this.sounds.playWinSound();
        }

        if (this.isLastLevel) {
            this.ctx.font = '64px Roots';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('THE END', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.drawReplayButton(this.canvas.height / 2 + 40);
            return;
        }

        this.ctx.font = '48px Roots';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('LEVEL DONE', this.canvas.width / 2, this.canvas.height / 2 - 30);

        const signWidth = 220;
        const signHeight = 147; // aspect ratio of the next-level sign (768x512)
        this.nextLevelSign = {
            x: this.canvas.width / 2 - signWidth / 2,
            y: this.canvas.height / 2 + 5,
            width: signWidth,
            height: signHeight,
        };
        this.ctx.drawImage(this.nextLevelSignImage, this.nextLevelSign.x, this.nextLevelSign.y, signWidth, signHeight);
    }

    /**
     * Checks whether the given canvas coordinates are over the (only-visible-after-victory) next-level sign.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {boolean} true if the point is inside the next-level sign's bounds.
     */
    isNextLevelSignHovered(mouseX, mouseY) {
        if (!this.getEndboss()?.isDead() || !this.nextLevelSign) return false;

        return mouseX >= this.nextLevelSign.x && mouseX <= this.nextLevelSign.x + this.nextLevelSign.width
            && mouseY >= this.nextLevelSign.y && mouseY <= this.nextLevelSign.y + this.nextLevelSign.height;
    }

    /**
     * Transitions to the next level if the next-level sign was clicked.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    handleNextLevelSignClick(mouseX, mouseY) {
        if (this.isNextLevelSignHovered(mouseX, mouseY)) {
            goToNextLevel(); // in game.js: builds a fresh World object with level2
        }
    }

    /**
     * Stops this World's render loop and intervals and pauses its sounds, so it can
     * be safely discarded when switching to a new level or restarting.
     * @returns {void}
     */
    stop() {
        this.stopped = true;
        (this.intervalIds || []).forEach(id => clearInterval(id));
        this.sounds.stop();
        this.destroyLevelObjects();
        this.pauseEntitySounds();
    }

    /**
     * Pauses every sound owned by the character and the enemies themselves (walking,
     * jumping, footsteps, hurt growls, ...) - clearing intervals alone doesn't stop
     * an Audio element that's already mid-playback/looping, so without this an enemy's
     * footsteps could keep looping in the background after the World is discarded.
     * @returns {void}
     */
    pauseEntitySounds() {
        [this.character.walkingSound, this.character.jumpSound, this.character.hurtSound]
            .filter(sound => sound)
            .forEach(sound => sound.pause());

        this.level.enemies.forEach(enemy => {
            if (enemy.footstepsSound) enemy.footstepsSound.pause();
            if (enemy.hurtSound) enemy.hurtSound.pause();
        });
    }

    /**
     * Clears every recurring interval owned by this level's own objects (character,
     * enemies, clouds, in-flight throwables), so none of them keep moving/animating
     * in the background after this World is discarded (restart, next level, replay).
     * @returns {void}
     */
    destroyLevelObjects() {
        this.character.clearIntervals();
        this.level.enemies.forEach(enemy => enemy.clearIntervals());
        this.level.clouds.forEach(cloud => cloud.clearIntervals());
        this.throwableObjects.forEach(potion => potion.clearIntervals());
        this.enemyProjectiles.forEach(projectile => projectile.clearIntervals());
        this.enemyThrowables.forEach(throwable => throwable.clearIntervals());
    }

    /**
     * Spawns a ranged projectile fired by an endboss towards the character, and
     * remembers it so it gets drawn, moved and checked for a hit each frame.
     * @param {number} x - Starting X position (usually the shooter's center).
     * @param {number} y - Starting Y position (usually the shooter's center).
     * @param {number} direction - 1 to fly right, -1 to fly left.
     * @param {number} [damage] - Damage dealt to the character on impact. Defaults to 10.
     * @returns {void}
     */
    spawnEnemyProjectile(x, y, direction, damage = 10) {
        this.enemyProjectiles.push(new EnemyProjectile(x, y, direction, damage));
    }

    /**
     * Spawns a bluish close-range throwable fired by an endboss towards the character
     * (same arc-throw physics as the character's own potions), and remembers it so it
     * gets drawn, moved and checked for a hit each frame.
     * @param {number} x - Starting X position (usually the shooter's center).
     * @param {number} y - Starting Y position (usually the shooter's center).
     * @param {number} direction - 1 to fly right, -1 to fly left.
     * @param {number} [damage] - Damage dealt to the character on impact. Defaults to 8.
     * @returns {void}
     */
    spawnEnemyThrowable(x, y, direction, damage = 8) {
        this.enemyThrowables.push(new EnemyThrowable(x, y, direction, damage));
    }

    /**
     * Draws every object in the given list.
     * @param {DrawableObject[]} objects - Objects to draw.
     * @returns {void}
     */
    addObjectToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    /**
     * Draws a single object, flipping it horizontally first if it faces the other direction.
     * @param {DrawableObject} mo - The object to draw.
     * @returns {void}
     */
    addToMap(mo) {
        if (!mo.img) return;

        if (mo.otherDirection) {
            this.flipImage(mo);
            mo.draw(this.ctx);
            this.ctx.restore();
        } else {
            mo.draw(this.ctx);
        }

        mo.drawFrame(this.ctx);
    }

    /**
     * Sets up a canvas transform that mirrors the given object horizontally around its own position.
     * @param {DrawableObject} mo - The object to flip.
     * @returns {void}
     */
    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
    }

    
    /**
     * Starts all of this World's recurring collision-check intervals and remembers
     * their IDs so stop() can clear them later.
     * @returns {void}
     */
    run() {
        const collisions = this.collisions;
        // remember the IDs so stop() can clear them on a level change
        this.intervalIds = [
            setInterval(() => collisions.checkCollisions(), 1000 / 60),
            setInterval(() => collisions.checkCollectables(), 200),
            setInterval(() => collisions.checkPotions(), 200),
            setInterval(() => collisions.checkScrolls(), 200),
            setInterval(() => collisions.checkAttackBooks(), 200),
            setInterval(() => collisions.checkThrowableCollisions(), 200),
            setInterval(() => collisions.checkEnemyProjectileCollisions(), 1000 / 30),
            setInterval(() => collisions.checkEnemyThrowableCollisions(), 1000 / 30),
        ];
    }

    /**
     * Called by the character when it attacks: delegates to the collision manager,
     * which damages every living enemy within range.
     * @returns {void}
     */
    handleCharacterAttack() {
        this.collisions.handleCharacterAttack();
    }

    /**
     * Throws a potion from the character's position in the direction it's facing,
     * if it's carrying at least one.
     * @returns {void}
     */
    throwPotion() {
        if (this.potionBar.count <= 0) return;

        let direction = this.character.otherDirection ? -1 : 1;
        let potion = new ThrowableObject(this.character.x + this.character.width / 2, this.character.y + 100);
        potion.throw(direction);

        this.throwableObjects.push(potion);
        this.potionBar.count--;
    }

    /**
     * Wires up the canvas's click and mousemove listeners for all HUD buttons and overlays.
     * @returns {void}
     */
    setupSoundButtonClick() {
        this.canvas.addEventListener('click', (event) => {
            const { mouseX, mouseY } = this.getCanvasMousePosition(event);
            this.soundButton.handleClick(mouseX, mouseY);
            this.homeButton.handleClick(mouseX, mouseY);
            this.pauseButton.handleClick(mouseX, mouseY);
            if (!isMobileLayout()) {
                this.fullscreenButton.handleClick(mouseX, mouseY);
            }
            this.handleReplayButtonClick(mouseX, mouseY);
            this.handleNextLevelSignClick(mouseX, mouseY);
        });

        this.canvas.addEventListener('mousemove', (event) => {
            const { mouseX, mouseY } = this.getCanvasMousePosition(event);
            this.updateCursor(mouseX, mouseY);
        });
    }

    /**
     * Converts a mouse event's page coordinates into canvas-space coordinates.
     * @param {MouseEvent} event - The mouse event to convert.
     * @returns {{mouseX: number, mouseY: number}} Mouse position in canvas coordinates.
     */
    getCanvasMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            mouseX: (event.clientX - rect.left) * scaleX,
            mouseY: (event.clientY - rect.top) * scaleY,
        };
    }

    /**
     * Updates the canvas cursor style depending on whether it's hovering any clickable HUD element.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    updateCursor(mouseX, mouseY) {
        const isOverButton = this.soundButton.isClicked(mouseX, mouseY)
            || this.homeButton.isClicked(mouseX, mouseY)
            || this.pauseButton.isClicked(mouseX, mouseY)
            || (!isMobileLayout() && this.fullscreenButton.isClicked(mouseX, mouseY))
            || this.isReplayButtonHovered(mouseX, mouseY)
            || this.isNextLevelSignHovered(mouseX, mouseY);

        this.canvas.style.cursor = isOverButton ? 'pointer' : 'default';
    }

    /**
     * Applies the given mute state to every sound effect, the background music and
     * (if present) the endboss's sounds.
     * @param {boolean} isMuted - Whether all sounds should be muted.
     * @returns {void}
     */
    applyMuteToAllSounds(isMuted) {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss || enemy instanceof EndbossLevel2);

        const extraSounds = [
            this.character.walkingSound,
            this.character.jumpSound,
            this.character.hurtSound,
            endboss ? endboss.footstepsSound : null,
            endboss ? endboss.hurtSound : null,
        ];

        this.sounds.applyMute(isMuted, extraSounds);
    }

    /**
     * Freezes/unfreezes the entire game (every character/enemy interval and all
     * collision checks) by toggling the global GAME_PAUSED flag. Wired to the
     * Pause button next to the home button - makes it much easier to inspect and
     * tune hitboxes with the debug overlay (H key), since nothing moves while paused.
     * @param {boolean} isPaused - Whether the game should be paused.
     * @returns {void}
     */
    applyPauseState(isPaused) {
        GAME_PAUSED = isPaused;
    }

}