class PotionBottle extends MovableObject {
    /**
     * Creates a static potion bottle placeholder object.
     */
    constructor() {
        super();
        this.loadImage('img/potion.png');
        this.x = 100;
        this.y = 300;
        this.width = 50;
        this.height = 50;
    }
}
