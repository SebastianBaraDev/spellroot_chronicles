let level1;
function initLevel1() {
level1 = new Level(
    [
        new Enemie(),
        new Enemie(),
        new Enemie(),
        new Enemie(),
        new Endboss(),
    ],
    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
    ],
    createBackgrounds(),
    createCollectables(10),
    createPotions(5),
    createScrolls(3)
);}

function createBackgrounds() {
    let backgrounds = [];
    for (let i = -2; i < 5; i++) {
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

function createCollectables(count) {
    let collectables = [];
    const startMargin = 300;
    const endMargin = 700;
    const usableWidth = (719 * 5) - startMargin - endMargin;
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
    const endMargin = 700;
    const usableWidth = (719 * 5) - startMargin - endMargin;
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
    const endMargin = 700;
    const usableWidth = (719 * 5) - startMargin - endMargin;
    const segmentWidth = usableWidth / count;

    for (let i = 0; i < count; i++) {
        let scroll = new ScrollObject();
        scroll.x = startMargin + i * segmentWidth + Math.random() * segmentWidth;
        scrolls.push(scroll);
    }
    return scrolls;
}