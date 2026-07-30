class AttackBookObject extends MovableObject {
    /**
     * Creates a collectible attack book that temporarily unlocks the character's attack ability.
     * @param {number} [x] - X position in the level. Defaults to 100 if omitted.
     * @param {number} [y] - Y position in the level. Defaults to 350 if omitted.
     */
    constructor(x, y) {
        super();
        this.loadImage('img/books/PNG/books (4).png');
        this.x = x ?? 100;
        this.y = y ?? 350;
        this.width = 60;
        this.height = 60;
    }
}
