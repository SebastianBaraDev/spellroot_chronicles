class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    level_end_x = 719 * 5; // Example end point for the level

    constructor(enemies, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}