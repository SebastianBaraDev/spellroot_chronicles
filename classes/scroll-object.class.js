class ScrollObject extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage('img/books/PNG/books (1).png');
        this.x = x ?? 100;
        this.y = y ?? 350;
        this.width = 50;
        this.height = 50;
    }
}