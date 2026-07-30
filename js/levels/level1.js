const LEVEL_WIDTH = 719 * 7; // must match level_end_x in level.class.js

const level1 = new Level(
    createEnemies(6),
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    createBackgrounds(),
    createCollectables(15),
    createPotions(7),
    createScrolls(2)
);

/**
 * Builds the repeating, alternately-flipped background/land/rock layers for level 1.
 * @returns {BackgroundObject[]} All background objects for level 1.
 */
function createBackgrounds() {
    let backgrounds = [];
    for (let i = -2; i < 7; i++) {
        let isFlipped = i % 2 !== 0;

        backgrounds.push(new BackgroundObject('img/backgrounds/PNG/background.png', 719 * i, 0, 350));

        let land = new BackgroundObject('img/backgrounds/PNG/land.png', 719 * i, 240, 240);
        let rock = new BackgroundObject('img/backgrounds/PNG/rock.png', 719 * i, 0, 350);

        if (isFlipped) {
            land.otherDirection = true;
            rock.otherDirection = true;
        }

        backgrounds.push(land, rock);
    }
    return backgrounds;
}

/**
 * Spreads the given number of regular enemies evenly across level 1 and appends the endboss.
 * @param {number} count - How many regular enemies to place.
 * @returns {(Enemie|Endboss)[]} The regular enemies followed by the endboss.
 */
function createEnemies(count) {
    let enemies = [];
    const startMargin = 900; // distance from level start, so no enemy stands right next to the character on load
    const endMargin = 900; // distance from level end, so no enemy appears too close to the endboss - enemies now spread further
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let enemy = new Enemie();
        // random position stays within the first half of the segment,
        // so there's always at least half a segment of space between two enemies
        enemy.x = startMargin + i * segmentWidth + Math.random() * (segmentWidth * 0.5);
        enemies.push(enemy);
    }

    enemies.push(new Endboss());
    return enemies;
}

/**
 * Spreads the given number of collectible crystals evenly across level 1.
 * @param {number} count - How many crystals to place.
 * @returns {CollectableObject[]} The placed crystals.
 */
function createCollectables(count) {
    let collectables = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so crystals no longer appear behind the endboss
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let crystal = new CollectableObject();
        crystal.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        crystal.y = 100 + Math.random() * 200;
        collectables.push(crystal);
    }
    return collectables;
}

/**
 * Spreads the given number of throwable potions evenly across level 1.
 * @param {number} count - How many potions to place.
 * @returns {ThrowableObject[]} The placed potions.
 */
function createPotions(count) {
    let potions = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so potions no longer appear behind the endboss
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let potion = new ThrowableObject();
        potion.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        potion.y = 100 + Math.random() * 200;
        potions.push(potion);
    }
    return potions;
}

/**
 * Spreads the given number of healing scrolls evenly across level 1.
 * @param {number} count - How many scrolls to place.
 * @returns {ScrollObject[]} The placed scrolls.
 */
function createScrolls(count) {
    let scrolls = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so scrolls no longer appear behind the endboss
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let scroll = new ScrollObject();
        scroll.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        scrolls.push(scroll);
    }
    return scrolls;
}
