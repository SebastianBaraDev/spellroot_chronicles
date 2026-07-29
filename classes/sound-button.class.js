class SoundButton extends DrawableObject {
    isMuted = false;

    constructor(canvasWidth, onToggle) {
        super();
        this.width = 40;
        this.height = 40;
        this.x = canvasWidth - this.width - 20;
        this.y = 20;
        this.onToggle = onToggle;
        this.updateImage();
    }

    updateImage() {
        this.loadImage(this.isMuted ? 'img/sound-off.png' : 'img/sound-on.png');
    }

    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width
            && mouseY >= this.y && mouseY <= this.y + this.height;
    }

    handleClick(mouseX, mouseY) {
        if (!this.isClicked(mouseX, mouseY)) return;

        this.isMuted = !this.isMuted;
        this.updateImage();
        this.onToggle(this.isMuted);
    }

    draw(ctx) {
        if (!this.img) return;

        // Bild proportional in die Box einpassen (wie "object-fit: contain"),
        // damit sound-off.png (anderes Seitenverhältnis als sound-on.png) nicht verzerrt wird
        const aspectRatio = this.img.naturalWidth / this.img.naturalHeight || 1; 
        let drawWidth = this.width;
        let drawHeight = this.width / aspectRatio;

        if (drawHeight > this.height) {
            drawHeight = this.height;
            drawWidth = this.height * aspectRatio;
        }

        const offsetX = this.x + (this.width - drawWidth) / 2;
        const offsetY = this.y + (this.height - drawHeight) / 2;

        ctx.filter = 'invert(1)'; // imgs are dark, invert to make them visible on dark background
        ctx.drawImage(this.img, offsetX, offsetY, drawWidth, drawHeight);
        ctx.filter = 'none'; // important: reset filter after drawing, otherwise it will affect other drawings
    }
}
