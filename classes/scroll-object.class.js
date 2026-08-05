class ScrollObject extends MovableObject {
    offset = { top: 4, bottom: 5, left: 6, right: 5 }; // measured from the scroll artwork's actual (transparent-padded) content

    /**
     * Creates a collectible healing scroll.
     * @param {number} [x] - X position in the level. Defaults to 100 if omitted.
     * @param {number} [y] - Y position in the level. Defaults to 350 if omitted.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/books/PNG/books (1).png');
        this.x = x ?? 100;
        this.y = y ?? 350;
        this.width = 50;
        this.height = 50;
    }
}
