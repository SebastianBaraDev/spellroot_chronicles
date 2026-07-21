class CollectableObject extends MovableObject {
    constructor() {
        super();
        this.loadImage('img/crystal.png');
        this.x = 200 + Math.random() * 2000; // Random x position for each crystal
        this.y = 200 + Math.random() * 100; // Random y position for each crystal
        this.width = 50;
        this.height = 50;
    }

    
}