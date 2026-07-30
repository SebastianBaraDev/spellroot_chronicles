class World {
    character = new Character();
    level = level1;
    statusBar = new StatusBar();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    collectableBar = new CollectableBar();
    potionBar = new PotionBar();
    crystalSound = new Audio('audio/coin-collect.mp3');
    scrollSound = new Audio('audio/item-pickup.mp3');
    bottleCrashSound = new Audio('audio/bottle-crash.mp3');
    potionSound = new Audio('audio/bottle-collect.mp3');
    stompSound = new Audio('audio/enemy-hit.mp3');
    gameOverSound = new Audio('audio/game-over.mp3');
    gameOverTriggered = false;
    replayButtonImage = new Image();
    replayButton = null;
    backgroundMusic = new Audio('audio/bg-music.mp3');
    winSound = new Audio('audio/win-sound.mp3');
    levelCompleteTriggered = false;
    nextLevelSignImage = new Image();
    nextLevelSign = null;
    stopped = false;
    isLastLevel = false;

    constructor(canvas, keyboard, level = level1, isLastLevel = false) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level;
        this.isLastLevel = isLastLevel;
        this.replayButtonImage.src = 'img/replay-btn.png';
        this.nextLevelSignImage.src = 'img/btn-next-level.png';
        this.soundButton = new SoundButton(this.canvas.width, (isMuted) => this.applyMuteToAllSounds(isMuted));
        this.fullscreenButton = new FullscreenButton(this.canvas.width, this.canvas.height, () => toggleFullscreen());
        this.draw();
        this.setWorld();
        this.run();
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.play().catch(() => {}); // if browser blocks autoplay, catch the error to prevent console errors
        this.setupSoundButtonClick();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    draw() {
        if (this.stopped) return; // altes World-Objekt nach einem Levelwechsel nicht mehr weiterzeichnen

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing

        this.ctx.translate(this.camera_x, 0); // Move the camera

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);

        // Draw collectable objects first, so that enemies appear behind them (not in front)
        this.addObjectToMap(this.level.collectableObject);
        this.addObjectToMap(this.level.potionObjects);
        this.addObjectToMap(this.level.scrollObjects);

        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Move the camera back to the original position

        this.addToMap(this.statusBar); // Statusbar fixed on screen (outside camera translate)
        this.addToMap(this.collectableBar); // Collectable bar fixed on screen (outside camera translate)
        this.addToMap(this.potionBar);
        this.addToMap(this.soundButton);
        if (!isMobileLayout()) {
            this.addToMap(this.fullscreenButton); // on mobile the fullscreen button is not displayed, so it doesn't need to be drawn
        }

        if (this.character.isDead()) {
            this.handleGameOver();
        } else if (this.getEndboss()?.isDead()) {
            this.handleLevelComplete();
        }

        if (!this.stopped) {
            requestAnimationFrame(() => this.draw()); // Call draw again on the next frame
        }
    }

    getEndboss() {
        return this.level.enemies.find(enemy => enemy instanceof Endboss || enemy instanceof EndbossLevel2);
    }

    handleGameOver() {
        if (!this.gameOverTriggered) {
            this.gameOverTriggered = true;
            this.gameOverSound.currentTime = 0;
            this.gameOverSound.play();
        }

        this.ctx.font = '64px Roots';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);

        const buttonSize = 80;
        this.replayButton = {
            x: this.canvas.width / 2 - buttonSize / 2,
            y: this.canvas.height / 2 + 40,
            width: buttonSize,
            height: buttonSize,
        };
        this.ctx.filter = 'invert(1)';
        this.ctx.drawImage(this.replayButtonImage, this.replayButton.x, this.replayButton.y, buttonSize, buttonSize);
        this.ctx.filter = 'none';
    }

    isReplayButtonHovered(mouseX, mouseY) {
        if (!this.character.isDead() || !this.replayButton) return false;

        return mouseX >= this.replayButton.x && mouseX <= this.replayButton.x + this.replayButton.width
            && mouseY >= this.replayButton.y && mouseY <= this.replayButton.y + this.replayButton.height;
    }

    handleReplayButtonClick(mouseX, mouseY) {
        if (this.isReplayButtonHovered(mouseX, mouseY)) {
            location.reload(); // reset the game and move to the start screen
        }
    }

    handleLevelComplete() {
        if (!this.levelCompleteTriggered) {
            this.levelCompleteTriggered = true;
            this.winSound.currentTime = 0;
            this.winSound.play().catch(() => {});
        }

        if (this.isLastLevel) {
            this.ctx.font = '64px Roots';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('THE END', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        this.ctx.font = '48px Roots';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('LEVEL DONE', this.canvas.width / 2, this.canvas.height / 2 - 30);

        const signWidth = 220;
        const signHeight = 147; // Seitenverhaeltnis des Next-Level-Schilds (768x512)
        this.nextLevelSign = {
            x: this.canvas.width / 2 - signWidth / 2,
            y: this.canvas.height / 2 + 5,
            width: signWidth,
            height: signHeight,
        };
        this.ctx.drawImage(this.nextLevelSignImage, this.nextLevelSign.x, this.nextLevelSign.y, signWidth, signHeight);
    }

    isNextLevelSignHovered(mouseX, mouseY) {
        if (!this.getEndboss()?.isDead() || !this.nextLevelSign) return false;

        return mouseX >= this.nextLevelSign.x && mouseX <= this.nextLevelSign.x + this.nextLevelSign.width
            && mouseY >= this.nextLevelSign.y && mouseY <= this.nextLevelSign.y + this.nextLevelSign.height;
    }

    handleNextLevelSignClick(mouseX, mouseY) {
        if (this.isNextLevelSignHovered(mouseX, mouseY)) {
            goToNextLevel(); // in game.js: baut ein frisches World-Objekt mit level2 auf
        }
    }

    stop() {
        this.stopped = true;
        (this.intervalIds || []).forEach(id => clearInterval(id));
        this.backgroundMusic.pause();
        this.winSound.pause();
    }

    addObjectToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

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

    flipImage(mo){
            this.ctx.save();
            this.ctx.translate(mo.x + mo.width, mo.y);
            this.ctx.scale(-1, 1);
    }

    
    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            const isCollidingNow = this.character.isColliding(enemy);
            const wasCollidingBefore = enemy.wasColliding || false;
            enemy.wasColliding = isCollidingNow; // Zustand fuer den naechsten Frame merken

            if (!isCollidingNow) return;
            if (enemy.isDead()) return; // Skip collision if enemy is dead

            // Nur im allerersten Kontakt-Frame entscheiden, ob es ein Stomp war - das macht die
            // Erkennung unabhaengig davon, wie tief der Charakter durch einen grossen Physik-Tick
            // schon in den Gegner "hineingefallen" ist.
            if (!wasCollidingBefore && this.isStompOnEnemy(enemy)) {
                this.stompEnemy(enemy);
                return;
            }

            if (!this.character.isHurt()) { // Only hit if the character is not already hurt
                this.character.hit();
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    getCharacterBottom() {
        return this.character.y + this.character.height - this.character.offset.bottom;
    }

    isStompOnEnemy(enemy) {
        const characterBottom = this.getCharacterBottom();
        const enemyTop = enemy.y + enemy.offset.top;
        const enemyBottom = enemy.y + enemy.height - enemy.offset.bottom;
        const enemyCenterY = (enemyTop + enemyBottom) / 2;

        // Im Moment des ersten Kontakts: stehen die Fuesse noch oberhalb der Gegner-Mitte?
        // Das reicht als Stomp - auch eine Beruehrung mit der Fussspitze zaehlt, solange sie von oben kommt.
        return characterBottom < enemyCenterY;
    }

    stompEnemy(enemy) {
        enemy.hit();
        this.stompSound.currentTime = 0;
        this.stompSound.play();
        if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
        this.character.speedY = 15; // kleiner Abpraller nach oben
    }

    checkCollectables() {
    this.level.collectableObject.forEach(crystal => {
        if (crystal.img && this.character.isColliding(crystal)) {
            crystal.img = null;
            this.collectableBar.count++;
            this.crystalSound.currentTime = 0; // Reset the sound to the beginning
            this.crystalSound.play();
        }
    });
    }

    checkPotions() {
        this.level.potionObjects.forEach(potion => {
            if (potion.img && this.character.isColliding(potion)) {
                potion.img = null;
                this.potionBar.count++;
                this.potionSound.currentTime = 0;
                this.potionSound.play();
            }
        });
    }

    checkScrolls() {
        this.level.scrollObjects.forEach(scroll => {
            if (scroll.img && this.character.isColliding(scroll)) {
                scroll.img = null;
                this.character.energy = Math.min(this.character.energy + 25, 100);
                this.statusBar.setPercentage(this.character.energy);
                this.scrollSound.currentTime = 0; // Reset the sound to the beginning
                this.scrollSound.play();
            }
        });
    }

    run() {
        // IDs merken, damit stop() sie beim Levelwechsel beenden kann
        this.intervalIds = [
            setInterval(() => this.checkCollisions(), 1000 / 60),
            setInterval(() => this.checkCollectables(), 200),
            setInterval(() => this.checkPotions(), 200),
            setInterval(() => this.checkScrolls(), 200),
            setInterval(() => this.checkThrowableCollisions(), 200),
        ];
    }

    throwPotion() {
        if (this.potionBar.count <= 0) return;

        let direction = this.character.otherDirection ? -1 : 1;
        let potion = new ThrowableObject(this.character.x + this.character.width / 2, this.character.y + 100);
        potion.throw(direction);

        this.throwableObjects.push(potion);
        this.potionBar.count--;
    }

   checkThrowableCollisions() {
        this.throwableObjects.forEach(potion => {
            this.level.enemies.forEach(enemy => {
                if (!potion.img || !potion.isColliding(enemy)) return;
                if (enemy.isDead()) return; // toter Gegner nimmt keinen Schaden/Sound mehr

                enemy.hit();
                potion.img = null;
                this.bottleCrashSound.currentTime = 0; // Reset the sound to the beginning
                this.bottleCrashSound.play();
                if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
            });
        });
    }

    scheduleEnemyRemoval(enemy) {
        if (enemy instanceof Endboss || enemy instanceof EndbossLevel2) return; // Do not remove the endboss

        if (enemy.removalScheduled) return;
        enemy.removalScheduled = true;

        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, enemy.IMAGES_DIE.length * 100); // wait for the die animation to finish before removing the enemy
    }

    setupSoundButtonClick() {
        this.canvas.addEventListener('click', (event) => {
            const { mouseX, mouseY } = this.getCanvasMousePosition(event);
            this.soundButton.handleClick(mouseX, mouseY);
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

    getCanvasMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            mouseX: (event.clientX - rect.left) * scaleX,
            mouseY: (event.clientY - rect.top) * scaleY,
        };
    }

    updateCursor(mouseX, mouseY) {
        const isOverButton = this.soundButton.isClicked(mouseX, mouseY)
            || (!isMobileLayout() && this.fullscreenButton.isClicked(mouseX, mouseY))
            || this.isReplayButtonHovered(mouseX, mouseY)
            || this.isNextLevelSignHovered(mouseX, mouseY);

        this.canvas.style.cursor = isOverButton ? 'pointer' : 'default';
    }

    applyMuteToAllSounds(isMuted) {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss || enemy instanceof EndbossLevel2);

        const sounds = [
            this.backgroundMusic,
            this.crystalSound,
            this.scrollSound,
            this.bottleCrashSound,
            this.character.walkingSound,
            this.character.jumpSound,
            this.character.hurtSound,
            this.potionSound,
            this.stompSound,
            this.gameOverSound,
            this.winSound,
            endboss ? endboss.footstepsSound : null,
            endboss ? endboss.hurtSound : null,
        ];

        sounds.filter(sound => sound).forEach(sound => sound.muted = isMuted);
    }

}