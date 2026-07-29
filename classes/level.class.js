class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    collectableObject = [];
    potionObjects = [];
    scrollObjects = [];
    level_end_x = 719 * 6; // Example end point for the level

    constructor(enemies, clouds, backgroundObjects, collectableObject, potionObjects, scrollObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableObject = collectableObject;
        this.potionObjects = potionObjects;
        this.scrollObjects = scrollObjects;
    }
}