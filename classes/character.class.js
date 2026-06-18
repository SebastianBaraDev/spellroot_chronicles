class Character extends MovableObject {
    height = 300;
    width = 450;
    y = 135;
    x = -50;
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

    constructor() {
        super().loadImage('./img/wizards/PNG/2_WIZARD/Wizard_02__RUN_000.png');
        this.loadImages(this.IMAGES_RUN);

        this.animate();
    }

    animate() {

        setInterval(() => {
            let i = this.currentImage % this.IMAGES_RUN.length; // Loop through images
            let path = this.IMAGES_RUN[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100); 
    }

    jump() {
        console.log('Jumping');
    }
}