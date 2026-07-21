class CollectableBar extends DrawableObject {
    count = 0;

    constructor() {
        super();
        this.loadImage('img/crystal.png');
        this.x = 20;
        this.y = 70; // positon above the status bar
        this.width = 40;
        this.height = 40;
    }

    draw(ctx) {
        super.draw(ctx); // draw the crystal image
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('x ' + this.count, this.x + this.width + 10, this.y + this.height - 10);
    }
}