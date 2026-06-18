class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    SPACE = false;

    constructor() {
        window.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft') this.LEFT = true;
            if (event.code === 'ArrowRight') this.RIGHT = true;
            if (event.code === 'ArrowUp') this.UP = true;
            if (event.code === 'Space') this.SPACE = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowLeft') this.LEFT = false;
            if (event.code === 'ArrowRight') this.RIGHT = false;
            if (event.code === 'ArrowUp') this.UP = false;
            if (event.code === 'Space') this.SPACE = false;
        });
    }
}