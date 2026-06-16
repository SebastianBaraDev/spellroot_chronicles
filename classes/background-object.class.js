class BackgroundObject extends MovableObject {

    width = 720;
    height = 240;
    constructor(imagePath, x, y, height) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.height = height;
    }
}