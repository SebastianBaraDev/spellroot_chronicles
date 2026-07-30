/**
 * Owns every sound effect and the background music, and centralizes playing
 * and muting them. World delegates all sound playback to an instance of this class.
 */
class SoundManager {
    crystalSound = new Audio('audio/coin-collect.mp3');
    scrollSound = new Audio('audio/item-pickup.mp3');
    bottleCrashSound = new Audio('audio/bottle-crash.mp3');
    potionSound = new Audio('audio/bottle-collect.mp3');
    stompSound = new Audio('audio/enemy-hit.mp3');
    gameOverSound = new Audio('audio/game-over.mp3');
    backgroundMusic = new Audio('audio/bg-music.mp3');
    winSound = new Audio('audio/win-sound.mp3');

    /**
     * Sets up the background music to loop and configures the (quieter) volumes
     * for the music and the win sound.
     */
    constructor() {
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.winSound.volume = 0.3;
    }

    /**
     * Starts the looping background music. Swallows the rejection browsers throw
     * when autoplay is blocked before the first user interaction.
     * @returns {void}
     */
    startBackgroundMusic() {
        this.backgroundMusic.play().catch(() => {});
    }

    /**
     * Plays the crystal-collect sound from the start.
     * @returns {void}
     */
    playCrystal() {
        this.crystalSound.currentTime = 0;
        this.crystalSound.play();
    }

    /**
     * Plays the scroll/attack-book pickup sound from the start.
     * @returns {void}
     */
    playScroll() {
        this.scrollSound.currentTime = 0;
        this.scrollSound.play();
    }

    /**
     * Plays the thrown-potion impact sound from the start.
     * @returns {void}
     */
    playBottleCrash() {
        this.bottleCrashSound.currentTime = 0;
        this.bottleCrashSound.play();
    }

    /**
     * Plays the potion-collect sound from the start.
     * @returns {void}
     */
    playPotion() {
        this.potionSound.currentTime = 0;
        this.potionSound.play();
    }

    /**
     * Plays the enemy-stomp/attack-hit sound from the start.
     * @returns {void}
     */
    playStomp() {
        this.stompSound.currentTime = 0;
        this.stompSound.play();
    }

    /**
     * Plays the game-over sound from the start.
     * @returns {void}
     */
    playGameOver() {
        this.gameOverSound.currentTime = 0;
        this.gameOverSound.play();
    }

    /**
     * Plays the level-complete/win sound from the start. Swallows the rejection
     * browsers throw when autoplay is blocked.
     * @returns {void}
     */
    playWinSound() {
        this.winSound.currentTime = 0;
        this.winSound.play().catch(() => {});
    }

    /**
     * Pauses the background music and win sound. Called when the World stops.
     * @returns {void}
     */
    stop() {
        this.backgroundMusic.pause();
        this.winSound.pause();
    }

    /**
     * Applies the given mute state to every sound managed here, plus any extra
     * sounds passed in (e.g. the character's and endboss's own sounds, which
     * this class doesn't own).
     * @param {boolean} isMuted - Whether all sounds should be muted.
     * @param {(HTMLAudioElement|null|undefined)[]} [extraSounds] - Additional sounds to mute/unmute alongside this manager's own.
     * @returns {void}
     */
    applyMute(isMuted, extraSounds = []) {
        const sounds = [
            this.backgroundMusic,
            this.crystalSound,
            this.scrollSound,
            this.bottleCrashSound,
            this.potionSound,
            this.stompSound,
            this.gameOverSound,
            this.winSound,
            ...extraSounds,
        ];

        sounds.filter(sound => sound).forEach(sound => sound.muted = isMuted);
    }
}
