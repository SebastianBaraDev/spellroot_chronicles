class World {
    character = new Character();
    enemies = [
        new Enemie(),
        new Enemie(),
        new Enemie()
    ];
    clouds = [
        new Cloud(),
        new Cloud(),
    ];
    backgroundObjects = [
        new BackgroundObject('img/4/PNG/background.png', 0, 0),
        new BackgroundObject('img/4/PNG/land.png', 0, 240, 240),
        new BackgroundObject('img/4/PNG/rock.png', 0, 0, 350),
    ];
    canvas;
    ctx;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas before drawing

        this.addObjectToMap(this.backgroundObjects);
        this.addToMap(this.character);
        this.addObjectToMap(this.enemies);
        this.addObjectToMap(this.clouds);

        requestAnimationFrame(() => this.draw()); // Call draw again on the next frame
    }

    addObjectToMap(objects) {
        objects.forEach(obj => this.addToMap(obj));
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.x + movableObject.width, movableObject.y);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(movableObject.img, 0, 0, movableObject.width, movableObject.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
        }
}

}