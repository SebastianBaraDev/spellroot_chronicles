
const level1 = new Level(
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
    ],
    createBackgrounds()
);


function createBackgrounds() {
    let backgrounds = [];
    for (let i = -2; i < 5; i++) {
        let isFlipped = i % 2 !== 0; // every odd index will be flipped

        backgrounds.push(new BackgroundObject('img/4/PNG/background.png', 719 * i, 0, 350));

        let land = new BackgroundObject('img/4/PNG/land.png', 719 * i, 240, 240);
        let rock = new BackgroundObject('img/4/PNG/rock.png', 719 * i, 0, 350);

        if (isFlipped) {
            land.otherDirection = true;
            rock.otherDirection = true;
        }

        backgrounds.push(land, rock);
    }
    return backgrounds;
}