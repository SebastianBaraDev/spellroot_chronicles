class Character extends MovableObject {
    height = 300;
    width = 450;
    y = 0;
    x = -50;
    speed = 5;
    otherDirection = false; // Assuming character faces right by default
    IMAGES_RUN = [
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_000.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_001.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_002.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_003.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_004.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_005.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_006.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_007.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_008.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__RUN_009.png',
        ];

    IMAGES_JUMP = [
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_000.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_001.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_002.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_003.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_004.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_005.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_006.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_007.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_008.png',
            'img/wizards/PNG/2_WIZARD/Wizard_02__JUMP_009.png'
        ];

    offset = { top: 80, bottom: 20, left: 160, right: 150 };
    world;
    walking_sound = new Audio('audio/running.mp3');

    constructor() {
        super().loadImage('./img/wizards/PNG/2_WIZARD/Wizard_02__RUN_000.png');
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_JUMP);
        this.applyGravity();
        this.animate();
    }

    animate() {

        setInterval(() => {
            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x -780) { // Prevent moving right beyond the level end
                this.moveRight();
                this.otherDirection = false;
                this.walking_sound.play();
            }

            if (this.world.keyboard.LEFT && this.x > 0) { // Prevent moving left beyond the starting point
                this.moveLeft();
                this.otherDirection = true;
                this.walking_sound.play();
            }

            if (this.world.keyboard.UP && !this.isAboveGround()){
                this.jump();
            }

            this.world.camera_x = -this.x + -50; // Move the camera based on the character's position
        }, 1000 / 60); // Run at 60 FPS

        setInterval(() => {

            if(this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMP);
            } else {

                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                 //Walk Animation
                    this.playAnimation(this.IMAGES_RUN);
                }
            }
        }, 50); 
    }

}