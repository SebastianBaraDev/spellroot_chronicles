class StatusBar extends DrawableObject {

    ENERGY = [
        "img/statusbar/1/spellroot_bar_000pct.png",
        "img/statusbar/1/spellroot_bar_020pct.png",
        "img/statusbar/1/spellroot_bar_040pct.png",
        "img/statusbar/1/spellroot_bar_060pct.png",
        "img/statusbar/1/spellroot_bar_080pct.png",
        "img/statusbar/1/spellroot_bar_100pct.png"
    ];

    percentage = 100;

    /**
     * Creates the health status bar, preloads its images and starts it at full health.
     */
    constructor() {
        super();
        this.loadImages(this.ENERGY);
        this.x = 0;
        this.y = 0;
        this.width = 240;
        this.height = 80;
        this.setPercentage(100);
    }

    /**
     * Updates the health percentage and swaps in the matching bar image.
     * @param {number} percentage - Current health percentage (0-100).
     * @returns {void}
     */
    setPercentage(percentage){
        this.percentage = percentage; // => 0 ... 5
        let path = this.ENERGY[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Maps the current health percentage to the matching frame index in ENERGY.
     * @returns {number} Index into the ENERGY array (0 = empty, 5 = full).
     */
    resolveImageIndex(){
        if(this.percentage == 100){
            return 5;
        } else if(this.percentage > 80){
            return 4;
        } else if(this.percentage > 60){
            return 3;
        } else if(this.percentage > 40){
            return 2;
        } else if(this.percentage > 20){
            return 1;
        } else {
            return 0;
        }
    }

}
