/**
 * Puts the #fullscreen wrapper element into fullscreen mode.
 * @returns {void}
 */
function fullscreen() {
    let fullscreen = document.getElementById('fullscreen');
    enterFullscreen(fullscreen);
}

/**
 * Enters or exits fullscreen depending on the current state.
 * @returns {void}
 */
function toggleFullscreen() {
    let fullscreenElement = document.getElementById('fullscreen');

    if (isCurrentlyFullscreen()) {
        exitFullscreen();
    } else {
        enterFullscreen(fullscreenElement);
    }
}

/**
 * Checks whether any element on the page is currently displayed in fullscreen,
 * across the different vendor-prefixed APIs.
 * @returns {boolean} true if the page is currently in fullscreen mode.
 */
function isCurrentlyFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement
        || document.mozFullScreenElement || document.msFullscreenElement);
}

/**
 * Requests fullscreen for the given element, trying every vendor-prefixed API.
 * @param {HTMLElement} element - Element to display in fullscreen.
 * @returns {void}
 */
function enterFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
        element.msRequestFullscreen();
    }
}

/**
 * Leaves fullscreen mode, trying every vendor-prefixed API.
 * @returns {void}
 */
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}
