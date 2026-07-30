const LEVEL2_WIDTH = 719 * 7; // must match level_end_x in level.class.js

const level2 = new Level(
    createEnemiesLevel2(6, 3),
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    createBackgroundsLevel2(),
    createCollectablesLevel2(12),
    createPotionsLevel2(9),
    createScrollsLevel2(2),
    createAttackBookLevel2()
);

/**
 * Builds the repeating, alternately-flipped purple background/land/rock layers for level 2.
 * @returns {BackgroundObject[]} All background objects for level 2.
 */
function createBackgroundsLevel2() {
    let backgrounds = [];
    for (let i = -2; i < 7; i++) {
        let isFlipped = i % 2 !== 0;

        backgrounds.push(new BackgroundObject('img/backgrounds/PNG2/background-purple.png', 719 * i, 0, 350));

        let land = new BackgroundObject('img/backgrounds/PNG2/land-purple.png', 719 * i, 240, 240);
        let rock = new BackgroundObject('img/backgrounds/PNG2/rock-purple.png', 719 * i, 0, 350);

        if (isFlipped) {
            land.otherDirection = true;
            rock.otherDirection = true;
        }

        backgrounds.push(land, rock);
    }
    return backgrounds;
}

/**
 * Builds and places every regular enemy for level 2 (halved-size jumpers plus
 * normal-size hammer orks), then appends the level 2 endboss.
 * @param {number} smallCount - How many halved-size jumping enemies to place.
 * @param {number} orkCount - How many normal-size hammer orks to place.
 * @returns {(EnemieLevel2|OrkEnemieLevel2|EndbossLevel2)[]} The enemies followed by the endboss.
 */
function createEnemiesLevel2(smallCount, orkCount) {
    const startMargin = 1000; // pushed back further so nothing appears right after the level starts
    const endBoundary = 4500; // stays clear of the endboss's own (very padded) sprite bounding box

    const enemies = shuffleArray([
        ...Array.from({ length: smallCount }, () => new EnemieLevel2()),
        ...Array.from({ length: orkCount }, () => new OrkEnemieLevel2()),
    ]);
    placeEnemiesWithSpacing(enemies, startMargin, endBoundary);

    enemies.push(new EndbossLevel2());
    return enemies;
}

/**
 * Randomizes the order of an array without mutating the original (Fisher-Yates shuffle).
 * @param {Array} array - The array to shuffle.
 * @returns {Array} A new array with the same items in randomized order.
 */
function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

/**
 * Lines enemies up left to right between startX and endX with a guaranteed minimum
 * gap between their hitboxes, so differently-sized enemies (like the much wider
 * orks) can never spawn overlapping or right on top of each other.
 * @param {MovableObject[]} enemies - Enemies to position, in the order they'll appear.
 * @param {number} startX - Leftmost x position the first enemy may use.
 * @param {number} endX - Rightmost x position the last enemy's hitbox may reach.
 * @returns {void}
 */
function placeEnemiesWithSpacing(enemies, startX, endX) {
    const minGap = 15;
    const totalWidth = enemies.reduce((sum, enemy) => sum + enemy.width, 0);
    const totalMinGaps = minGap * Math.max(0, enemies.length - 1);
    const extraSlack = Math.max(0, (endX - startX) - totalWidth - totalMinGaps);
    const slackPerGap = enemies.length > 1 ? extraSlack / (enemies.length - 1) : 0;

    let cursorX = startX;
    enemies.forEach(enemy => {
        enemy.x = cursorX;
        cursorX += enemy.width + minGap + Math.random() * slackPerGap;
    });
}

/**
 * Spreads the given number of collectible crystals evenly across level 2.
 * @param {number} count - How many crystals to place.
 * @returns {CollectableObject[]} The placed crystals.
 */
function createCollectablesLevel2(count) {
    let collectables = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so crystals don't appear behind the endboss
    const usableWidth = LEVEL2_WIDTH - startMargin - endMargin;
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
 * Spreads the given number of throwable potions evenly across level 2.
 * @param {number} count - How many potions to place.
 * @returns {ThrowableObject[]} The placed potions.
 */
function createPotionsLevel2(count) {
    let potions = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so potions don't appear behind the endboss
    const usableWidth = LEVEL2_WIDTH - startMargin - endMargin;
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
 * Spreads the given number of healing scrolls evenly across level 2.
 * @param {number} count - How many scrolls to place.
 * @returns {ScrollObject[]} The placed scrolls.
 */
function createScrollsLevel2(count) {
    let scrolls = [];
    const startMargin = 300;
    const endMargin = 1700; // increased so scrolls don't appear behind the endboss
    const usableWidth = LEVEL2_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let scroll = new ScrollObject();
        scroll.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        scrolls.push(scroll);
    }
    return scrolls;
}

/**
 * Places a single attack book in the last third of level 2, well before the endboss.
 * @returns {AttackBookObject[]} A one-element array containing the placed book.
 */
function createAttackBookLevel2() {
    // placed once in the last third of the level, but still well before the endboss
    const rangeStart = LEVEL2_WIDTH * 2 / 3;
    const rangeEnd = LEVEL2_WIDTH - 850;

    let book = new AttackBookObject();
    book.x = rangeStart + Math.random() * (rangeEnd - rangeStart);
    book.y = 100 + Math.random() * 200;
    return [book];
}
