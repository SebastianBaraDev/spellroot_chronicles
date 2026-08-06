class OrkEnemieLevel2 extends MovableObject {
    height = 350;
    width = 583; // scaled proportionally from 300x180 to a height of 350
    y = 105; // 15px lower than the previous value, still a bit higher than the original 120
    otherDirection = true;
    energy = 5;
    attacking = false;
    offset = { top: 150, bottom: 30, left: 191, right: 210 }; // scaled proportionally (factor ~1.94) from the level 1 enemy offset

    ATTACK_RANGE = 220; // distance at which the ork tries to attack with the hammer

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

    /**
     * Creates a normal-size level 2 ork enemy at a random position/speed and starts its animation.
     */
    constructor() {
        super().loadImage('./img/enemies/1_ORK/ORK_01_RUN_000.png');
        this.loadImages(this.IMAGES_RUN);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DIE);

        this.x = 200 + Math.random() * 2000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.animate();
    }

    /**
     * Starts the ork's movement loop, its run/attack/death animation loop and its
     * proximity check for the hammer attack. No jumping - the ork stays on the
     * ground and only pauses during the hammer attack.
     * @returns {void}
     */
    animate() {
        this.registerInterval(() => {
            if (!this.isDead() && !this.attacking) this.moveLeft();
        }, 1000 / 60);

        this.registerInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.attacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else {this.playAnimation(this.IMAGES_RUN);}
        }, 100);

        this.registerInterval(() => this.checkAttackRange(), 200);
    }

    /**
     * Switches the ork into hammer attack mode (and pauses its movement) as soon
     * as the character comes within ATTACK_RANGE.
     * @returns {void}
     */
    checkAttackRange() {
        if (!this.world || this.isDead()) return;

        const distance = Math.abs(this.world.character.x - this.x);
        this.attacking = distance < this.ATTACK_RANGE;
    }
}
