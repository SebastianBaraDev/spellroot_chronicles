class CollectableObject extends MovableObject {
    offset = { top: 4, bottom: 4, left: 4, right: 4 }; // measured from crystal.png's actual (transparent-padded) artwork

    /**
     * Creates a collectible crystal at a random position within the level's crystal band.
     */
    constructor() {
        super();
        this.loadImage('img/crystal.png');
        this.x = 200 + Math.random() * 2000; // Random x position for each crystal
        this.y = 200 + Math.random() * 100; // Random y position for each crystal
        this.width = 50;
        this.height = 50;
    }
}
