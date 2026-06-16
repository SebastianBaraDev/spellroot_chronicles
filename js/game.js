let canvas;
let world;

function initializeGame() {
    canvas = document.getElementById('gameCanvas');
    world = new World(canvas);

    console.log('My Character is: ', world.character);
    console.log('My Enemies are: ', world.enemies);
}