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

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = level1;
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character.world = this;
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

        requestAnimationFrame(() => this.draw()); // Call draw again on the next frame
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
        if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
        this.character.speedY = 15; // kleiner Abpraller nach oben
    }

    checkCollectables() {
    this.level.collectableObject.forEach(crystal => {
        if (crystal.img && this.character.isColliding(crystal)) {
            crystal.img = null;
            this.collectableBar.count++;
        }
    });
    }

    checkPotions() {
        this.level.potionObjects.forEach(potion => {
            if (potion.img && this.character.isColliding(potion)) {
                potion.img = null;
                this.potionBar.count++;
            }
        });
    }

    checkScrolls() {
        this.level.scrollObjects.forEach(scroll => {
            if (scroll.img && this.character.isColliding(scroll)) {
                scroll.img = null;
                this.character.energy = Math.min(this.character.energy + 25, 100);
                this.statusBar.setPercentage(this.character.energy);
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
                if (potion.img && potion.isColliding(enemy)) {
                    enemy.hit();
                    potion.img = null;
                    if (enemy.isDead()) this.scheduleEnemyRemoval(enemy);
                }
            });
        });
    }

    scheduleEnemyRemoval(enemy) {
        if (enemy.removalScheduled) return;
        enemy.removalScheduled = true;

        setTimeout(() => {
            this.level.enemies = this.level.enemies.filter(e => e !== enemy);
        }, enemy.IMAGES_DIE.length * 100); // wait for the die animation to finish before removing the enemy
    }

}