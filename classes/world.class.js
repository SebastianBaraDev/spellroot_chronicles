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

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level1;
        this.replayButtonImage.src = 'img/replay-btn.png';
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing

        this.ctx.translate(this.camera_x, 0); // Move the camera

        this.addObjectToMap(this.level.backgroundObjects);

        this.addObjectToMap(this.level.enemies);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.throwableObjects);
        this.addObjectToMap(this.level.collectableObject);
        this.addObjectToMap(this.level.potionObjects);
        this.addObjectToMap(this.level.scrollObjects);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // Move the camera back to the original position

        this.addToMap(this.statusBar); // Statusbar fixed on screen (outside camera translate)
        this.addToMap(this.collectableBar); // Collectable bar fixed on screen (outside camera translate)
        this.addToMap(this.potionBar);
        this.addToMap(this.soundButton);
        this.addToMap(this.fullscreenButton);

        if (this.character.isDead()) {
            this.handleGameOver();
        }

        requestAnimationFrame(() => this.draw()); // Call draw again on the next frame
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
        this.ctx.filter = 'invert(1)';
        this.ctx.drawImage(this.replayButtonImage, this.replayButton.x, this.replayButton.y, buttonSize, buttonSize);
        this.ctx.filter = 'none';
        this.ctx.filter = 'none';
    }

    handleReplayButtonClick(mouseX, mouseY) {
        if (!this.character.isDead() || !this.replayButton) return;

        const isClicked = mouseX >= this.replayButton.x && mouseX <= this.replayButton.x + this.replayButton.width
            && mouseY >= this.replayButton.y && mouseY <= this.replayButton.y + this.replayButton.height;

        if (isClicked) {
            location.reload(); // führt zurück zum Startscreen und setzt das komplette Spiel zurück
        }
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
            if (!this.character.isColliding(enemy)) return;
            if (enemy.isDead()) return; // Skip collision if enemy is dead

            if (this.isStompOnEnemy(enemy)) {
                this.stompEnemy(enemy);
            } else if (!this.character.isHurt()) { // Only hit if the character is not already hurt
                this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    isStompOnEnemy(enemy) {
        const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;
        const isFalling = this.character.speedY < 0;

        return isFalling && characterBottom < enemyTop + 40; // kleiner Toleranzbereich
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
        setInterval(() => this.checkCollisions(), 1000 / 60);
        setInterval(() => this.checkCollectables(), 200);
        setInterval(() => this.checkPotions(), 200);
        setInterval(() => this.checkScrolls(), 200);
        setInterval(() => this.checkThrowableCollisions(), 200);
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
        if (enemy instanceof Endboss) return; // Do not remove the endboss

        if (enemy.removalScheduled) return;
        enemy.removalScheduled = true;

        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, enemy.IMAGES_DIE.length * 100); // wait for the die animation to finish before removing the enemy
    }

    setupSoundButtonClick() {
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;
            const mouseX = (event.clientX - rect.left) * scaleX;
            const mouseY = (event.clientY - rect.top) * scaleY;
            this.soundButton.handleClick(mouseX, mouseY);
            this.fullscreenButton.handleClick(mouseX, mouseY);
            this.handleReplayButtonClick(mouseX, mouseY);
        });
    }

    applyMuteToAllSounds(isMuted) {
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);

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
            endboss ? endboss.footstepsSound : null,
            endboss ? endboss.hurtSound : null,
        ];

        sounds.filter(sound => sound).forEach(sound => sound.muted = isMuted);
    }

}