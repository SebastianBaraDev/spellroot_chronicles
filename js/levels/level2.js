const LEVEL2_WIDTH = 719 * 7; // muss zu level.class.js level_end_x passen

const level2 = new Level(
    createEnemiesLevel2(6),
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
    createScrollsLevel2(2)
);

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

function createEnemiesLevel2(count) {
    let enemies = [];
    const startMargin = 900; // Abstand zum Levelstart, damit kein Gegner direkt beim Laden neben dem Character steht
    const endMargin = 900; // Abstand zum Levelende, damit kein Gegner zu nah am Endboss auftaucht
    const usableWidth = LEVEL2_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let enemy = new EnemieLevel2();
        // Zufallsposition bleibt auf die erste Haelfte des Segments beschraenkt,
        // damit zwischen zwei Gegnern immer mindestens ein halbes Segment Platz ist
        enemy.x = startMargin + i * segmentWidth + Math.random() * (segmentWidth * 0.5);
        enemies.push(enemy);
    }

    // 4 Orks in normaler Level-1-Groesse, die den Character bei Naeherung mit dem Hammer angreifen
    const orkCount = 4;
    const orkSegmentWidth = usableWidth / orkCount;
    for (let i = 0; i < orkCount; i++) {
        let ork = new OrkEnemieLevel2();
        // in der zweiten Haelfte jedes Ork-Segments platziert, damit sie sich seltener
        // mit den kleinen springenden Gegnern ueberlappen
        ork.x = startMargin + i * orkSegmentWidth + orkSegmentWidth * 0.5 + Math.random() * (orkSegmentWidth * 0.3);
        enemies.push(ork);
    }

    enemies.push(new EndbossLevel2());
    return enemies;
}

function createCollectablesLevel2(count) {
    let collectables = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Kristalle nicht hinter dem Endboss auftauchen
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

function createPotionsLevel2(count) {
    let potions = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Flaschen nicht hinter dem Endboss auftauchen
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

function createScrollsLevel2(count) {
    let scrolls = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Schriftrollen nicht hinter dem Endboss auftauchen
    const usableWidth = LEVEL2_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let scroll = new ScrollObject();
        scroll.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        scrolls.push(scroll);
    }
    return scrolls;
}
