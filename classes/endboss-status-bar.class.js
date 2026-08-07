class EndbossStatusBar extends StatusBar {

    ENERGY = [
        "img/statusbar/2/spellroot_boss_bar_000pct.png",
        "img/statusbar/2/spellroot_boss_bar_010pct.png",
        "img/statusbar/2/spellroot_boss_bar_020pct.png",
        "img/statusbar/2/spellroot_boss_bar_030pct.png",
        "img/statusbar/2/spellroot_boss_bar_040pct.png",
        "img/statusbar/2/spellroot_boss_bar_050pct.png",
        "img/statusbar/2/spellroot_boss_bar_060pct.png",
        "img/statusbar/2/spellroot_boss_bar_070pct.png",
        "img/statusbar/2/spellroot_boss_bar_080pct.png",
        "img/statusbar/2/spellroot_boss_bar_090pct.png",
        "img/statusbar/2/spellroot_boss_bar_100pct.png"
    ];

    /**
     * Creates the endboss energy bar (red, with a skull instead of the character's
     * scroll), positioned top-right, just below the HOME/PAUSE/MUTE buttons.
     * @param {number} canvasWidth - Width of the game canvas, used to right-align the bar.
     */
    constructor(canvasWidth) {
        super();
        // StatusBar's constructor already called loadImages()/setPercentage() via super(), but at
        // that point "this.ENERGY" still resolved to StatusBar's own field (subclass class-field
        // overrides are only applied AFTER super() returns) - so it loaded the wrong (green,
        // 6-frame) image set. Redo both now that this.ENERGY correctly points at our red 11-frame set.
        this.width = 240; // same size as the character's own status bar
        this.height = 80;
        this.x = canvasWidth - this.width - 12;
        this.y = 70; // just below the HOME/PAUSE/MUTE row (buttons sit at y:20-22, height ~36-40)
        this.loadImages(this.ENERGY);
        this.setPercentage(100);
    }

    /**
     * Maps the current boss-energy percentage (0-100, in 10% steps) to the matching
     * frame index in ENERGY.
     * @returns {number} Index into the ENERGY array (0 = empty, 10 = full).
     */
    resolveImageIndex() {
        const clamped = Math.max(0, Math.min(100, this.percentage));
        return Math.round(clamped / 10);
    }
}
