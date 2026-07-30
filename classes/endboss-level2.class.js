class EndbossLevel2 extends MovableObject {
    otherDirection = true;
    energy = 35; // 7 Treffer mit einer Flasche (je 5 Schaden) noetig
    footstepsSound = new Audio('audio/monster-footsteps.mp3');
    hurtSound = new Audio('audio/dragon-growl.mp3');
    offset = { top: 46, bottom: 20, left: 296, right: 257 }; // proportional zur groesseren Sprite-Ausgabe skaliert

    groundY = -190; // an die groessere Hoehe angepasst, damit die Fuesse auf gleicher Bodenlinie bleiben
    y = -190;
    speedY = 0;
    jumping = false;
    attacking = false;

    IMAGES_WALK = [
        'img/enemies/3_ORK/ORK_03_WALK_000.png',
        'img/enemies/3_ORK/ORK_03_WALK_001.png',
        'img/enemies/3_ORK/ORK_03_WALK_002.png',
        'img/enemies/3_ORK/ORK_03_WALK_003.png',
        'img/enemies/3_ORK/ORK_03_WALK_004.png',
        'img/enemies/3_ORK/ORK_03_WALK_005.png',
        'img/enemies/3_ORK/ORK_03_WALK_006.png',
        'img/enemies/3_ORK/ORK_03_WALK_007.png',
        'img/enemies/3_ORK/ORK_03_WALK_008.png',
        'img/enemies/3_ORK/ORK_03_WALK_009.png',
    ];
    IMAGES_JUMP = [
        'img/enemies/3_ORK/ORK_03_JUMP_000.png',
        'img/enemies/3_ORK/ORK_03_JUMP_001.png',
        'img/enemies/3_ORK/ORK_03_JUMP_002.png',
        'img/enemies/3_ORK/ORK_03_JUMP_003.png',
        'img/enemies/3_ORK/ORK_03_JUMP_004.png',
        'img/enemies/3_ORK/ORK_03_JUMP_005.png',
        'img/enemies/3_ORK/ORK_03_JUMP_006.png',
        'img/enemies/3_ORK/ORK_03_JUMP_007.png',
        'img/enemies/3_ORK/ORK_03_JUMP_008.png',
        'img/enemies/3_ORK/ORK_03_JUMP_009.png',
    ];
    IMAGES_ATTACK = [
        'img/enemies/3_ORK/ORK_03_ATTAK_000.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_001.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_002.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_003.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_004.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_005.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_006.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_007.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_008.png',
        'img/enemies/3_ORK/ORK_03_ATTAK_009.png',
    ];
    IMAGES_HURT = [
        'img/enemies/3_ORK/ORK_03_HURT_000.png',
        'img/enemies/3_ORK/ORK_03_HURT_001.png',
        'img/enemies/3_ORK/ORK_03_HURT_002.png',
        'img/enemies/3_ORK/ORK_03_HURT_003.png',
        'img/enemies/3_ORK/ORK_03_HURT_004.png',
        'img/enemies/3_ORK/ORK_03_HURT_005.png',
        'img/enemies/3_ORK/ORK_03_HURT_006.png',
        'img/enemies/3_ORK/ORK_03_HURT_007.png',
        'img/enemies/3_ORK/ORK_03_HURT_008.png',
        'img/enemies/3_ORK/ORK_03_HURT_009.png',
    ];
    IMAGES_DIE = [
        'img/enemies/3_ORK/ORK_03_DIE_000.png',
        'img/enemies/3_ORK/ORK_03_DIE_001.png',
        'img/enemies/3_ORK/ORK_03_DIE_002.png',
        'img/enemies/3_ORK/ORK_03_DIE_003.png',
        'img/enemies/3_ORK/ORK_03_DIE_004.png',
        'img/enemies/3_ORK/ORK_03_DIE_005.png',
        'img/enemies/3_ORK/ORK_03_DIE_006.png',
        'img/enemies/3_ORK/ORK_03_DIE_007.png',
        'img/enemies/3_ORK/ORK_03_DIE_008.png',
        'img/enemies/3_ORK/ORK_03_DIE_009.png',
    ];

    constructor() {
        super().loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
        this.x = 4338;
        this.y = this.groundY;
        this.speed = 0.1;
        this.height = 650;
        this.width = 900;
        this.animate();
        this.startJumpLoop();
        this.startAttackLoop();
        this.footstepsSound.loop = true;
        this.footstepsSound.volume = 0.3;
    }

    animate() {
        setInterval(() => {
            if (!this.isDead() && !this.attacking) this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            if (this.isDead()) {
                this.playDeathAnimation();
            } else if (this.attacking) {
                this.playAnimation(this.IMAGES_ATTACK);
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.jumping) {
                this.playAnimation(this.IMAGES_JUMP);
            } else {
                this.playAnimation(this.IMAGES_WALK);
            }
        }, 150);

        setInterval(() => this.handleFootstepsSound(), 300);
    }

    // Eigene, in sich geschlossene Sprungphysik (kleinere Sprungkraft als beim regulaeren
    // Level-2-Gegner) - aus denselben Gruenden wie bei EnemieLevel2 nicht auf
    // MovableObject.isAboveGround()/applyGravity() gestuetzt.
    startJumpLoop() {
        setInterval(() => {
            if (!this.isDead() && !this.jumping && !this.attacking) {
                this.startJump();
            }
        }, 3500 + Math.random() * 3000);

        setInterval(() => {
            if (!this.jumping) return;

            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.speedY = 0;
                this.jumping = false;
            }
        }, 1000 / 25);
    }

    startJump() {
        this.jumping = true;
        this.speedY = 8; // kleiner Sprung
    }

    // Periodischer Angriffsmodus mit der Axt: Bewegung pausiert waehrend der
    // Attack-Animation, damit der Axthieb glaubwuerdig wirkt.
    startAttackLoop() {
        setInterval(() => {
            if (!this.isDead() && !this.attacking && !this.jumping) {
                this.attacking = true;
                this.currentImage = 0;
                setTimeout(() => {
                    this.attacking = false;
                }, this.IMAGES_ATTACK.length * 150);
            }
        }, 4000 + Math.random() * 3000);
    }

    handleFootstepsSound() {
        if (!this.world) return;

        if (this.isDead()) {
            this.footstepsSound.pause();
            return;
        }

        const isVisible = this.x + this.width > -this.world.camera_x
            && this.x < -this.world.camera_x + this.world.canvas.width;

        isVisible ? this.footstepsSound.play() : this.footstepsSound.pause();
    }

    hit() {
        super.hit();
        this.hurtSound.currentTime = 0;
        this.hurtSound.play();
    }
}
