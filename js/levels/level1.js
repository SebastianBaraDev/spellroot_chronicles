const LEVEL_WIDTH = 719 * 7; // muss zu level.class.js level_end_x passen

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

function createEnemies(count) {
    let enemies = [];
    const startMargin = 900; // Abstand zum Levelstart, damit kein Gegner direkt beim Laden neben dem Character steht
    const endMargin = 900; // Abstand zum Levelende, damit kein Gegner zu nah am Endboss auftaucht - Gegner verteilen sich jetzt weiter
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let enemy = new Enemie();
        // Zufallsposition bleibt auf die erste Haelfte des Segments beschraenkt,
        // damit zwischen zwei Gegnern immer mindestens ein halbes Segment Platz ist
        enemy.x = startMargin + i * segmentWidth + Math.random() * (segmentWidth * 0.5);
        enemies.push(enemy);
    }

    enemies.push(new Endboss());
    return enemies;
}

function createCollectables(count) {
    let collectables = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Kristalle nicht mehr hinter dem Endboss auftauchen
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

function createPotions(count) {
    let potions = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Flaschen nicht mehr hinter dem Endboss auftauchen
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

function createScrolls(count) {
    let scrolls = [];
    const startMargin = 300;
    const endMargin = 1700; // vergroessert, damit Schriftrollen nicht mehr hinter dem Endboss auftauchen
    const usableWidth = LEVEL_WIDTH - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let scroll = new ScrollObject();
        scroll.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        scrolls.push(scroll);
    }
    return scrolls;
}
