class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;

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
        this.addToMap(this.character);
        this.addObjectToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0); // Move the camera back to the original position

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
                if (this.character.isColliding(enemy)) {
                    this.character.energy -= 5;
                    console.log('Kollision mit Enemy!', this.character.energy);
                }
                if (this.character.energy <= 0) {
                 
                }                
            });
    }

    run() {
        setInterval(() => this.checkCollisions(), 200);
    }

}