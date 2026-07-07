class StatusBar extends MovableObject {

    ENERGY = [
        "img/statusbar/1/spellroot_bar_000pct.png",
        "img/statusbar/1/spellroot_bar_200pct.png",
        "img/statusbar/1/spellroot_bar_400pct.png",
        "img/statusbar/1/spellroot_bar_600pct.png",
        "img/statusbar/1/spellroot_bar_800pct.png",
        "img/statusbar/1/spellroot_bar_1000pct.png"
    ];

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.ENERGY);
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage){
        this.percentage = percentage; // => 0 ... 5
        let path = this.ENERGY[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(){
        if(this.percentage == 100){
            return 5;
        } else if(this.percentage > 80){
            return 4;
        } else if(this.percentage > 60){
            return 3;
        } else if(this.percentage > 40){
            return 2;
        } else if(this.percentage > 20){
            return 1;
        } else {
            return 0;
        }
    }


}