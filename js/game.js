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
    canvas.addEventListener('mousemove', handleStartScreenMouseMove);
    setupMobileControls();
    drawStartScreen();
}

function drawStartScreen() {
    if (gameStarted) return; // hört auf sich selbst zu zeichnen, sobald das Spiel gestartet ist

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playButtonImage, playButton.x, playButton.y, playButton.width, playButton.height);

    if (!isMobileLayout()) {
        drawControlsHint();
    }

    requestAnimationFrame(drawStartScreen);
}

function isMobileLayout() {
    // gleiche Bildschirmbreiten-Grenze wie in styles.css fuer die Touch-Buttons
    return window.matchMedia('(max-width: 1024px)').matches;
}

function drawControlsHint() {
    ctx.font = '20px Roots, Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hintY = canvas.height - 30; // liegt unten im dunklen Bodenbereich
    ctx.fillText('◄ ►  Links/Rechts      ▲  Springen      D  Werfen', canvas.width / 2, hintY);
}

function getStartScreenMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        mouseX: (event.clientX - rect.left) * scaleX,
        mouseY: (event.clientY - rect.top) * scaleY,
    };
}

function isPlayButtonHovered(mouseX, mouseY) {
    return mouseX >= playButton.x && mouseX <= playButton.x + playButton.width
        && mouseY >= playButton.y && mouseY <= playButton.y + playButton.height;
}

function handleStartScreenClick(event) {
    if (gameStarted) return;

    const { mouseX, mouseY } = getStartScreenMousePosition(event);

    if (isPlayButtonHovered(mouseX, mouseY)) {
        startGame();
    }
}

function handleStartScreenMouseMove(event) {
    if (gameStarted) return;

    const { mouseX, mouseY } = getStartScreenMousePosition(event);
    canvas.style.cursor = isPlayButtonHovered(mouseX, mouseY) ? 'pointer' : 'default';
}

function setupMobileControls() {
    bindControlButton('mobile-btn-left', 'LEFT');
    bindControlButton('mobile-btn-right', 'RIGHT');
    bindControlButton('mobile-btn-jump', 'UP');
    bindControlButton('mobile-btn-throw', 'D');
}

function bindControlButton(buttonId, keyboardFlag) {
    const button = document.getElementById(buttonId);

    const press = (event) => {
        event.preventDefault(); // verhindert Scrollen/Zoomen beim Antippen
        if (!gameStarted) return;
        resumeBackgroundMusicIfNeeded();
        keyboard[keyboardFlag] = true;
    };

    const release = (event) => {
        event.preventDefault();
        keyboard[keyboardFlag] = false;
    };

    button.addEventListener('touchstart', press);
    button.addEventListener('touchend', release);
    button.addEventListener('touchcancel', release);
    button.addEventListener('mousedown', press);
    button.addEventListener('mouseup', release);
    button.addEventListener('mouseleave', release);
}

function startGame() {
    gameStarted = true;
    canvas.removeEventListener('click', handleStartScreenClick);
    document.getElementById('mobile-controls').classList.add('visible'); // Buttons sollen erst jetzt sichtbar werden
    document.body.classList.add('game-started'); // h1 darf auf dem Desktop jetzt wieder erscheinen

    if (isMobileLayout()) {
        enterFullscreen(document.getElementById('fullscreen')); // Handy/Tablet: direkt ins echte Fullscreen
    }

    world = new World(canvas, keyboard); // Level 1 startet erst hier
}

function goToNextLevel() {
    if (world) {
        world.stop(); // alte Spiel-Schleife (Intervalle, Sounds, requestAnimationFrame) beenden
    }
    world = new World(canvas, keyboard, level2, true); // level2 ist aktuell das letzte Level
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
