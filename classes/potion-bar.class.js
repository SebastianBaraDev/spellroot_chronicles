class PotionBar extends DrawableObject {
    count = 0;

    constructor() {
        super();
        this.loadImage('img/potion.png');
        this.x = 22;
        this.y = 120; // direkt unter der CollectableBar (die ist bei y = 90, height = 40)
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