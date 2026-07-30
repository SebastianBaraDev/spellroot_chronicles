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
        super.draw(ctx);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle'; // vertikal exakt auf Hoehe des Bild-Mittelpunkts
        ctx.fillText('x ' + this.count, this.x + this.width + 14, this.y + this.height / 2);
    }
}