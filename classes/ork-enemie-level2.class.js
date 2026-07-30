class OrkEnemieLevel2 extends MovableObject {
    height = 180;
    width = 300;
    y = 250; // gleiche Standflaeche wie die regulaeren Level-1-Gegner
    otherDirection = true;
    energy = 5;
    attacking = false;
    offset = { top: 18, bottom: 6, left: 98, right: 88 }; // Sprite-Seitenverhaeltnis entspricht dem des Level-1-Gegners

    ATTACK_RANGE = 220; // Abstand, ab dem der Ork mit dem Hammer anzugreifen versucht

    IMAGES_RUN = [
        'img/enemies/1_ORK/ORK_01_RUN_000.png',
        'img/enemies/1_ORK/ORK_01_RUN_001.png',
        'img/enemies/1_ORK/ORK_01_RUN_002.png',
        'img/enemies/1_ORK/ORK_01_RUN_003.png',
        'img/enemies/1_ORK/ORK_01_RUN_004.png',
        'img/enemies/1_ORK/ORK_01_RUN_005.png',
        'img/enemies/1_ORK/ORK_01_RUN_006.png',
        'img/enemies/1_ORK/ORK_01_RUN_007.png',
        'img/enemies/1_ORK/ORK_01_RUN_008.png',
        'img/enemies/1_ORK/ORK_01_RUN_009.png',
    ];
    IMAGES_ATTACK = [
        'img/enemies/1_ORK/ORK_01_ATTAK_000.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_001.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_002.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_003.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_004.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_005.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_006.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_007.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_008.png',
        'img/enemies/1_ORK/ORK_01_ATTAK_009.png',
    ];
    IMAGES_DIE = [
        'img/enemies/1_ORK/ORK_01_DIE_000.png',
        'img/enemies/1_ORK/ORK_01_DIE_001.png',
        'img/enemies/1_ORK/ORK_01_DIE_002.png',
        'img/enemies/1_ORK/ORK_01_DIE_003.png',
        'img/enemies/1_ORK/ORK_01_DIE_004.png',
        'img/enemies/1_ORK/ORK_01_DIE_005.png',
        'img/enemies/1_ORK/ORK_01_DIE_006.png',
        'img/enemies/1_ORK/ORK_01_DIE_007.png',
        'img/enemies/1_ORK/ORK_01_DIE_008.png',
        'img/enemies/1_ORK/ORK_01_DIE_009.png',
    ];

    constructor() {
        super().loadImage('./img/enemies/1_ORK/ORK_01_RUN_000.png');
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DIE);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    animate() {
        // Kein Sprung - der Ork bleibt am Boden und pausiert nur waehrend der Hammer-Attacke
        setInterval(() => {
            if (!this.isDead() && !this.attacking) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.attacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {
                this.playAnimation(this.IMAGES_RUN);
            }
        }, 100);

        setInterval(() => this.checkAttackRange(), 200);
    }

    // Sobald der Character nah genug ist, wechselt der Ork in den Hammer-Angriffsmodus
    // und bewegt sich waehrenddessen nicht weiter.
    checkAttackRange() {
        if (!this.world || this.isDead()) return;

        const distance = Math.abs(this.world.character.x - this.x);
        this.attacking = distance < this.ATTACK_RANGE;
    }
}
