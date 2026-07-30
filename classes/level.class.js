class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    collectableObject = [];
    potionObjects = [];
    scrollObjects = [];
    level_end_x = 719 * 7; // Level um 1 Segment verlaengert, damit der Endboss weiter hinten Platz hat

    constructor(enemies, clouds, backgroundObjects, collectableObject, potionObjects, scrollObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.collectableObject = collectableObject;
        this.potionObjects = potionObjects;
        this.scrollObjects = scrollObjects;
    }
}