class Character extends MovableObject {
    height = 300;
    width = 450;
    y = 135;
    x = -50;
    otherDirection = false; // Assuming character faces right by default
    IMAGES_IDLE = [
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_000.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_001.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_002.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_003.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_004.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_005.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_006.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_007.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_008.png',
            './img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_009.png',
        ];
    currentImage = 0;

    constructor() {
        super().loadImage('./img/wizards/PNG/2_WIZARD/Wizard_02__IDLE_000.png');
        this.loadImages(this.IMAGES_IDLE);

        this.animate();
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_IDLE.length; // Loop through images
            let path = this.IMAGES_IDLE[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000); 
    }

    jump() {
        console.log('Jumping');
    }
}