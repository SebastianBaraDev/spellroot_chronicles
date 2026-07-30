let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;
let selectedCharacterId = 'wizard2'; // default character, matches the previous single-character behavior

const startScreenImage = new Image();
startScreenImage.src = 'img/start-screen.png';

const playButtonImage = new Image();
playButtonImage.src = 'img/play-btn.png';

const playButton = { width: 140, height: 140 };

// Selectable characters shown small below the play button on the start screen.
// The source PNGs are 2800x1000 with the actual character taking up only a small part of that
// (lots of transparent padding), so each option crops down to just the character (measured via
// the sprite's alpha bounding box, plus a small margin) instead of drawing the full raw image.
const characterOptions = [
    { id: 'wizard1', image: new Image(), width: 90, height: 115, crop: { sx: 1158, sy: 233, sw: 610, sh: 745 } },
    { id: 'wizard2', image: new Image(), width: 90, height: 115, crop: { sx: 1189, sy: 333, sw: 641, sh: 645 } },
];
characterOptions.find(option => option.id === 'wizard1').image.src = 'img/wizards/PNG/1_WIZARD/Wizard_01__IDLE_000.png';
characterOptions.find(option => option.id === 'wizard2').image.src = 'img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_000.png';

/**
 * Boots the game: grabs the canvas, lays out the start screen UI, wires up input
 * listeners and starts the start screen's render loop.
 * @returns {void}
 */
function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    playButton.x = canvas.width / 2 - playButton.width / 2;
    playButton.y = canvas.height / 2 - playButton.height / 2; // adjust if needed, in case the "gap" in the image isn't centered

    layoutCharacterOptions();

    canvas.addEventListener('click', handleStartScreenClick);
    canvas.addEventListener('mousemove', handleStartScreenMouseMove);
    setupMobileControls();
    drawStartScreen();
}

/**
 * Renders one frame of the start screen (background, play button, character
 * selection, controls hint) and schedules the next frame until the game starts.
 * @returns {void}
 */
function drawStartScreen() {
    if (gameStarted) return; // stops drawing itself once the game has started

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playButtonImage, playButton.x, playButton.y, playButton.width, playButton.height);
    drawCharacterSelection();

    if (!isMobileLayout()) {
        drawControlsHint();
    }

    requestAnimationFrame(drawStartScreen);
}

/**
 * Checks whether the current viewport counts as a mobile/touch layout.
 * @returns {boolean} true if the viewport is at or below the mobile breakpoint.
 */
function isMobileLayout() {
    // same screen-width breakpoint as in styles.css for the touch buttons
    return window.matchMedia('(max-width: 1024px)').matches;
}

/**
 * Draws the keyboard controls hint text at the bottom of the start screen.
 * @returns {void}
 */
function drawControlsHint() {
    ctx.font = '26px Roots, Arial, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const hintY = canvas.height - 20; // sits at the bottom in the dark ground area, moved down slightly
    ctx.fillText('◄ ►  Links/Rechts      ▲  Springen      D  Werfen/Attacke', canvas.width / 2, hintY);
}

/**
 * Positions both character portraits side by side, centered under the play button.
 * @returns {void}
 */
function layoutCharacterOptions() {
    const gap = 10; // closer together, more centered as one visual group
    const totalWidth = characterOptions[0].width + characterOptions[1].width + gap;
    let startX = canvas.width / 2 - totalWidth / 2;
    const y = playButton.y + playButton.height + 10; // sits just above the controls hint text

    characterOptions.forEach(option => {
        option.x = startX;
        option.y = y;
        startX += option.width + gap;
    });
}

/**
 * Draws both character portraits, adding a glow behind whichever one is currently selected.
 * @returns {void}
 */
function drawCharacterSelection() {
    characterOptions.forEach(option => {
        if (option.id === selectedCharacterId) {
            ctx.save();
            ctx.shadowColor = '#7cf9ff';
            ctx.shadowBlur = 25;
            ctx.fillStyle = 'rgba(124, 249, 255, 0.35)';
            ctx.fillRect(option.x - 8, option.y - 8, option.width + 16, option.height + 16); // upright/portrait glow rectangle
            ctx.restore();
        }

        const { sx, sy, sw, sh } = option.crop;
        const scale = Math.min(option.width / sw, option.height / sh); // fit the crop into the box, keeping its aspect ratio
        const drawWidth = sw * scale;
        const drawHeight = sh * scale;
        const drawX = option.x + (option.width - drawWidth) / 2;
        const drawY = option.y + (option.height - drawHeight) / 2;

        ctx.drawImage(option.image, sx, sy, sw, sh, drawX, drawY, drawWidth, drawHeight);
    });
}

/**
 * Finds the character portrait (if any) under the given canvas coordinates.
 * @param {number} mouseX - Mouse X position in canvas coordinates.
 * @param {number} mouseY - Mouse Y position in canvas coordinates.
 * @returns {Object|undefined} The hovered option object, or undefined if none matched.
 */
function getHoveredCharacterOption(mouseX, mouseY) {
    return characterOptions.find(option =>
        mouseX >= option.x && mouseX <= option.x + option.width
        && mouseY >= option.y && mouseY <= option.y + option.height
    );
}

/**
 * Converts a mouse event's page coordinates into canvas-space coordinates.
 * @param {MouseEvent} event - The mouse event to convert.
 * @returns {{mouseX: number, mouseY: number}} Mouse position in canvas coordinates.
 */
function getStartScreenMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        mouseX: (event.clientX - rect.left) * scaleX,
        mouseY: (event.clientY - rect.top) * scaleY,
    };
}

/**
 * Checks whether the given canvas coordinates lie inside the play button.
 * @param {number} mouseX - Mouse X position in canvas coordinates.
 * @param {number} mouseY - Mouse Y position in canvas coordinates.
 * @returns {boolean} true if the point is inside the play button's bounds.
 */
function isPlayButtonHovered(mouseX, mouseY) {
    return mouseX >= playButton.x && mouseX <= playButton.x + playButton.width
        && mouseY >= playButton.y && mouseY <= playButton.y + playButton.height;
}

/**
 * Handles clicks on the start screen: selects a character portrait, or starts
 * the game if the play button was clicked.
 * @param {MouseEvent} event - The click event.
 * @returns {void}
 */
function handleStartScreenClick(event) {
    if (gameStarted) return;

    const { mouseX, mouseY } = getStartScreenMousePosition(event);

    const hoveredOption = getHoveredCharacterOption(mouseX, mouseY);
    if (hoveredOption) {
        selectedCharacterId = hoveredOption.id;
        return;
    }

    if (isPlayButtonHovered(mouseX, mouseY)) {
        startGame();
    }
}

/**
 * Updates the cursor style while hovering the start screen's interactive elements.
 * @param {MouseEvent} event - The mousemove event.
 * @returns {void}
 */
function handleStartScreenMouseMove(event) {
    if (gameStarted) return;

    const { mouseX, mouseY } = getStartScreenMousePosition(event);
    const isOverInteractiveElement = isPlayButtonHovered(mouseX, mouseY) || !!getHoveredCharacterOption(mouseX, mouseY);
    canvas.style.cursor = isOverInteractiveElement ? 'pointer' : 'default';
}

/**
 * Wires up all four on-screen mobile control buttons to their keyboard flags.
 * @returns {void}
 */
function setupMobileControls() {
    bindControlButton('mobile-btn-left', 'LEFT');
    bindControlButton('mobile-btn-right', 'RIGHT');
    bindControlButton('mobile-btn-jump', 'UP');
    bindControlButton('mobile-btn-throw', 'D');
}

/**
 * Binds a single on-screen control button's press/release to a Keyboard flag,
 * for both touch and mouse input.
 * @param {string} buttonId - DOM id of the button element.
 * @param {string} keyboardFlag - Name of the Keyboard property to toggle.
 * @returns {void}
 */
function bindControlButton(buttonId, keyboardFlag) {
    const button = document.getElementById(buttonId);

    const press = (event) => {
        event.preventDefault(); // prevents scrolling/zooming on tap
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

/**
 * Starts the game from the start screen: hides the start screen UI, shows the
 * mobile controls, enters fullscreen on mobile, and builds the level 1 World.
 * @returns {void}
 */
function startGame() {
    gameStarted = true;
    canvas.removeEventListener('click', handleStartScreenClick);
    document.getElementById('mobile-controls').classList.add('visible'); // buttons should only become visible now
    document.body.classList.add('game-started'); // h1 is allowed to reappear on desktop now

    if (isMobileLayout()) {
        enterFullscreen(document.getElementById('fullscreen')); // phone/tablet: go straight into real fullscreen
    }

    world = new World(canvas, keyboard, level1, false, selectedCharacterId); // level 1 only starts here
}

/**
 * Transitions from level 1 to level 2: stops the old World's loop/sounds and
 * builds a fresh World for level 2 with the previously selected character.
 * @returns {void}
 */
function goToNextLevel() {
    if (world) {
        world.stop(); // stop the old game loop (intervals, sounds, requestAnimationFrame)
    }
    world = new World(canvas, keyboard, level2, true, selectedCharacterId); // level2 is currently the last level
}

/**
 * Restarts the game after a Game Over without reloading the page - stops the old
 * World's loop/sounds, clears any keys still held down, and builds a fresh World
 * for level 1 with the previously selected character.
 * @returns {void}
 */
function restartGame() {
    if (world) {
        world.stop();
    }
    resetKeyboardState();
    world = new World(canvas, keyboard, level1, false, selectedCharacterId);
}

/**
 * Releases every movement/action key, so a restart never carries over a key that
 * was still held down at the moment of death.
 * @returns {void}
 */
function resetKeyboardState() {
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.UP = false;
    keyboard.DOWN = false;
    keyboard.SPACE = false;
    keyboard.D = false;
}

/**
 * Leaves the running game and returns to the start screen - stops the current
 * World's loop/sounds, clears the mobile controls/fullscreen state, and restarts
 * the start screen's own render loop.
 * @returns {void}
 */
function goToHomescreen() {
    if (world) {
        world.stop();
    }
    resetKeyboardState();
    gameStarted = false;

    document.body.classList.remove('game-started');
    document.getElementById('mobile-controls').classList.remove('visible');
    if (isCurrentlyFullscreen()) {
        exitFullscreen();
    }

    canvas.addEventListener('click', handleStartScreenClick); // re-attach, startGame() removed it
    drawStartScreen();
}

/**
 * Resumes the background music if it's paused (browsers block autoplay until
 * the first user interaction).
 * @returns {void}
 */
function resumeBackgroundMusicIfNeeded() {
    if (world && world.sounds.backgroundMusic.paused) {
        world.sounds.backgroundMusic.play().catch(() => {});
    }
}

/**
 * Maps keydown events to the shared Keyboard flags used by the character.
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
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

/**
 * Maps keyup events to the shared Keyboard flags used by the character.
 * @param {KeyboardEvent} event - The keyup event.
 * @returns {void}
 */
window.addEventListener('keyup', (event) => {
    if (!gameStarted) return;

    if (event.keyCode == 37) keyboard.LEFT = false;
    if (event.keyCode == 39) keyboard.RIGHT = false;
    if (event.keyCode == 38) keyboard.UP = false;
    if (event.keyCode == 40) keyboard.DOWN = false;
    if (event.keyCode == 32) keyboard.SPACE = false;
    if (event.keyCode == 68) keyboard.D = false;
});
