class FullscreenButton extends DrawableObject {
    constructor(canvasWidth, canvasHeight, onClick) {
        super();
        this.width = 36;
        this.height = 36;
        this.x = canvasWidth - this.width - 20;
        this.y = canvasHeight - this.height - 20;
        this.onClick = onClick;
        this.loadImage('img/fullscreen-btn.png');
    }

    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width
            && mouseY >= this.y && mouseY <= this.y + this.height;
    }

    handleClick(mouseX, mouseY) {
        if (!this.isClicked(mouseX, mouseY)) return;
        this.onClick();
    }

    draw(ctx) {
        if (!this.img) return;

        ctx.filter = 'invert(1)'; // Bild ist schwarz, invert(1) macht es weiß
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.filter = 'none';
    }
}
