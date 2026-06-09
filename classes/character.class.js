class Character extends MovableObject {
    constructor(x, y, img) {
        super(x, y, img);
    }

    jump() {
        console.log('Jumping');
    }
}