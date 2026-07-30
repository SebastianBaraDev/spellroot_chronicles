class SoundButton extends DrawableObject {
    static STORAGE_KEY = 'spellroot_muted';

    isMuted = false;

    /**
     * Creates the mute/unmute button and restores the persisted mute preference.
     * @param {number} canvasWidth - Width of the game canvas, used to position the button.
     * @param {Function} onToggle - Callback invoked with the new mute state whenever it's toggled.
     */
    constructor(canvasWidth, onToggle) {
        super();
        this.width = 40;
        this.height = 40;
        this.x = canvasWidth - this.width - 20;
        this.y = 20;
        this.onToggle = onToggle;
        this.isMuted = this.loadMutedState();
        this.updateImage();
    }

    /**
     * Reads the persisted mute preference from localStorage.
     * @returns {boolean} true if the game was muted the last time the preference was saved.
     */
    loadMutedState() {
        return localStorage.getItem(SoundButton.STORAGE_KEY) === 'true';
    }

    /**
     * Persists the current mute preference so it survives a page reload.
     * @returns {void}
     */
    saveMutedState() {
        localStorage.setItem(SoundButton.STORAGE_KEY, this.isMuted);
    }

    /**
     * Swaps the button icon to match the current mute state.
     * @returns {void}
     */
    updateImage() {
        this.loadImage(this.isMuted ? 'img/sound-off.png' : 'img/sound-on.png');
    }

    /**
     * Checks whether the given canvas coordinates lie inside the button.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {boolean} true if the point is inside the button's bounds.
     */
    isClicked(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= this.x + this.width
            && mouseY >= this.y && mouseY <= this.y + this.height;
    }

    /**
     * Toggles the mute state if the click landed on the button, persists it and notifies the caller.
     * @param {number} mouseX - Mouse X position in canvas coordinates.
     * @param {number} mouseY - Mouse Y position in canvas coordinates.
     * @returns {void}
     */
    handleClick(mouseX, mouseY) {
        if (!this.isClicked(mouseX, mouseY)) return;

        this.isMuted = !this.isMuted;
        this.updateImage();
        this.saveMutedState();
        this.onToggle(this.isMuted);
    }

    /**
     * Draws the icon inverted (dark artwork on a dark HUD), scaled to fit within the
     * button's bounds while keeping its own aspect ratio.
     * @param {CanvasRenderingContext2D} ctx - Canvas rendering context to draw into.
     * @returns {void}
     */
    draw(ctx) {
        if (!this.img) return;

        const aspectRatio = this.img.naturalWidth / this.img.naturalHeight || 1;  
        let drawWidth = this.width;
        let drawHeight = this.width / aspectRatio;

        if (drawHeight > this.height) {             // If the calculated height exceeds the button's height, adjust width and height to fit
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
