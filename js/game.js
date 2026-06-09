let canvas;
let ctx;
let world = new World();

function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    console.log('My Character is: ', world.character);
    console.log('My Enemies are: ', world.enemies);
}