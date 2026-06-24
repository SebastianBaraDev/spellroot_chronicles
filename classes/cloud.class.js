class Cloud extends MovableObject {
    height = 70;
    width = 250;
    y = 20  ;

    constructor() {
        super().loadImage('img/Clouds_black/Shape2/cloud_shape2_2.png');
        this.x = Math.random() * 720; // Random x position for each cloud
        this.animate()
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000/60); // Run at 60 FPS
    }

}