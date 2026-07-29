let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

const startScreenImage = new Image();
startScreenImage.src = 'img/start-screen.png';

const playButtonImage = new Image();
playButtonImage.src = 'img/play-btn.png';

const playButton = { width: 140, height: 140 };

function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    playButton.x = canvas.width / 2 - playButton.width / 2;
    playButton.y = canvas.height / 2 - playButton.height / 2; // ggf. anpassen, falls die "Lücke" im Bild nicht mittig liegt

    canvas.addEventListener('click', handleStartScreenClick);
    drawStartScreen();
}

function drawStartScreen() {
    if (gameStarted) return; // hört auf sich selbst zu zeichnen, sobald das Spiel gestartet ist

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playButtonImage, playButton.x, playButton.y, playButton.width, playButton.height);

    requestAnimationFrame(drawStartScreen);
}

function handleStartScreenClick(event) {
    if (gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const isPlayButtonClicked = mouseX >= playButton.x && mouseX <= playButton.x + playButton.width
        && mouseY >= playButton.y && mouseY <= playButton.y + playButton.height;

    if (isPlayButtonClicked) {
        startGame();
    }
}

function startGame() {
    gameStarted = true;
    canvas.removeEventListener('click', handleStartScreenClick);
    world = new World(canvas, keyboard); // Level 1 startet erst hier
}

function resumeBackgroundMusicIfNeeded() {
    if (world && world.backgroundMusic.paused) {
        world.backgroundMusic.play().catch(() => {});
    }
}

window.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    resumeBackgroundMusicIfNeeded();
    if (event.keyCode == 37) keyboard.LEFT = true;
    if (event.keyCode == 39) keyboard.RIGHT = true;
    if (event.keyCode == 38) keyboard.UP = true;
    if (event.keyCode == 40) keyboard.DOWN = true;
    if (event.keyCode == 32) keyboard.SPACE = true;
    if (event.keyCode == 68) keyboard.D = true;
});

window.addEventListener('keyup', (event) => {
    if (!gameStarted) return;

    if (event.keyCode == 37) keyboard.LEFT = false;
    if (event.keyCode == 39) keyboard.RIGHT = false;
    if (event.keyCode == 38) keyboard.UP = false;
    if (event.keyCode == 40) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 68) keyboard.D = false;
});
