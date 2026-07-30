class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    collectableObject = [];
    potionObjects = [];
    scrollObjects = [];
    attackBookObjects = [];
    level_end_x = 719 * 7; // level extended by 1 segment so the endboss has room further back

    /**
     * Bundles all objects that make up one playable level.
     * @param {Array} enemies - Enemies (including the endboss) placed in this level.
     * @param {Array} clouds - Decorative cloud objects.
     * @param {Array} backgroundObjects - Scrolling/static background layers.
     * @param {Array} collectableObject - Collectible crystals.
     * @param {Array} potionObjects - Throwable potions the character can pick up.
     * @param {Array} scrollObjects - Healing scrolls.
     * @param {Array} [attackBookObjects] - Attack books that unlock the character's attack ability. Defaults to an empty array.
     */
    constructor(enemies, clouds, backgroundObjects, collectableObject, potionObjects, scrollObjects, attackBookObjects = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableObject = collectableObject;
        this.potionObjects = potionObjects;
        this.scrollObjects = scrollObjects;
        this.attackBookObjects = attackBookObjects;
    }
}
