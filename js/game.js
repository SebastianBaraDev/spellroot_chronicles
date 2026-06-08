let canvas;
let ctx;
let character = new MovableObject(20, 20, 'img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_000.png');

function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    ctx.drawImage(character.img, character.x, character.y, 50, 150);

    console.log('My Character is: ', character);
}