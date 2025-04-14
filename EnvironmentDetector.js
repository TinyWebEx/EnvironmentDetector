/**
 * Caching wrapper for AddonSettings API that does save and load settings.
 *
 * @module EnvironmentDetector
 */

import * as Helper from "./internal/Helper.js";

export const POPUP_TYPE = {
    OVERFLOW: Symbol("overflow menu popup"),
    USUAL: Symbol("usual browser button popup"),
    NEW_PAGE: Symbol("full page, opened in new tab, e.g. on Android"),
};

export const POPUP_SIZE = {
    MAX: Symbol("maximum value")
};

export const SIZE = {
    WIDTH: Symbol("width"),
    HEIGHT: Symbol("height"),
};

const MAX_POPUP_SIZE = {
    [POPUP_TYPE.USUAL]: {
        WIDTH: 800,
        HEIGHT: 600,
    },
    [POPUP_TYPE.OVERFLOW]: {
        WIDTH: 348,
        HEIGHT: null,
    }
};

// cache/retrieve value for OS directly at startup
let cachedOs;
browser.runtime.getPlatformInfo().then((platformInfo) => {
    cachedOs = platformInfo.os;
});

/**
 * Returns the popup environment this is running in.
 *
 * @public
 * @returns {Object|null}
 */
export function getPopupType() {
    let overflowWidth;

    // https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/PlatformOs
    switch (cachedOs) {
    case "android":
        return POPUP_TYPE.NEW_PAGE;
    case "win":
        overflowWidth = 348;
        break;
    default:
        overflowWidth = 425;
    }

    if (
        window.innerWidth === overflowWidth
    ) {
        return POPUP_TYPE.OVERFLOW;
    } else {
        return POPUP_TYPE.USUAL;
    }
}

/**
 * Returns the size of the popup.
 *
 * Only really useful if POPUP_TYPE.USUAL, so you can find out whether the
 * popup has been maximum sized.
 *
 * @public
 * @returns {Object|null}
 */
export function getPopupSize() {
    const popupType = getPopupType();

    return {
        width: (window.innerWidth === MAX_POPUP_SIZE[popupType].WIDTH) ? POPUP_SIZE.MAX : window.innerWidth,
        height: (window.innerHeight === MAX_POPUP_SIZE[popupType].HEIGHT) ? POPUP_SIZE.MAX : window.innerHeight,
    };
}

/**
 * Waits until the popup has completly opened.
 *
 * It may happen that all the other function return wrong/bad values, if the
 * popup is not opened yet, if you are requesting these values very fast at the
 * side loading.
 * (still "folding" up)
 * To prevent this, call this function asyncronously, i.e. e.g. await the Promise.
 *
 * By default it retries 10x in 50ms intervals, i.e. 0.5 seconds.
 *
 * @public
 * @param {number} [retries=10] how often to retry at most
 * @param {number} [delay=10] how many ms to re-check
 * @returns {Promise}
 */
export async function waitForPopupOpen(retries = 10, delay = 50) {
    const wait = (ms) => new Promise((func) => setTimeout(func, ms));

    // values are correctly loaded
    if (window.innerWidth !== 0 && window.innerHeight !== 0) {
        return Promise.resolve();
    }

    if (retries <= 0) {
        // should usually never™ happen, https://xkcd.com/2200/
        throw new TypeError("no re-tries left, popup is not opened"); // will be converted into rejected promise
    }

    await wait(delay);

    // retry
    return waitForPopupOpen(retries - 1, delay);
}

/**
 * Returns whether we are running in a popup.
 *
 * @todo needs testing
 * @public
 * @returns {boolean}
 */
export function isPopup() {
    // window.outer* is the size of the main Firfox window
    // If window.inner* is significantly smaller, this may be a popup.

    if (getPopupType() === POPUP_TYPE.OVERFLOW) {
        return true;
    }
    if (cachedOs === "android") {
        // Android never has popups
        return false;
    }

    // If it is the same as window size, our main window is likely maximized
    const outerIsAsScreenSize = ((
        pageOverflows(SIZE.WIDTH) ?
            Helper.isSameSizeWithScrollbar(screen.availWidth, window.outerWidth) :
            screen.availWidth === window.outerWidth
    ) && (
        pageOverflows(SIZE.HEIGHT) ?
            Helper.isSameSizeWithScrollbar(screen.availHeight, window.outerHeight) :
            screen.availHeight === window.outerHeight
    ));
    return outerIsAsScreenSize;
}

/**
 * Return debug data.
 *
 * @public
 * @returns {Object}
 */
export function getDebugData() {
    const getDocumentElement = (element) => {
        return {
            clientRects: element.getClientRects(),
            boundingClientRects: element.getBoundingClientRect(),
            clientWidth: element.clientWidth,
            clientHeight: element.clientHeight,
            offsetWidth: element.offsetWidth,
            offsetHeight: element.offsetHeight,
            scrollWidth: element.scrollWidth,
            scrollHeight: element.scrollHeight
        };
    };

    return {
        inner: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        },
        outer: {
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        },
        body: getDocumentElement(document.body),
        html: getDocumentElement(document.documentElement),
        scroll: getDocumentElement(document.scrollingElement),
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            left: window.screen.left,
            top: window.screen.top,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            availLeft: window.screen.availLeft,
            availTop: window.screen.availTop,
            mozOrientation: window.screen.mozOrientation,
            orientation: {
                angle: window.screen.orientation.angle,
                type: window.screen.orientation.type,
            },
            pixelDepth: window.screen.pixelDepth,
        }
    };
}

/**
 * Returns whether the page overlows.
 *
 * @public
 * @param {SIZE|null} size which size to check (or null for both)
 * @returns {boolean}
 */
export function pageOverflows(size) {
    let doesOverflow = false;

    if (!size || size === SIZE.WIDTH) {
        doesOverflow = doesOverflow || (getOverflowInPixels(SIZE.WIDTH) > 0);
    }
    if (!size || size === SIZE.HEIGHT) {
        doesOverflow = doesOverflow || (getOverflowInPixels(SIZE.HEIGHT) > 0);
    }

    return doesOverflow;
}

/**
 * Returns how many pixels the page overflows in one direction.
 *
 * @public
 * @param {SIZE} size which size to check
 * @returns {number}
 */
export function getOverflowInPixels(size) {
    switch (size) {
    case SIZE.WIDTH: {
        const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        if (overflow > 0) {
            return overflow;
        }

        // underflow
        return document.body.clientWidth - document.documentElement.clientWidth;
    } case SIZE.HEIGHT: {
        const overflow = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (overflow > 0) {
            return overflow;
        }

        // underflow
        return document.body.clientHeight - document.documentElement.clientHeight;
    } default:
        throw new TypeError("invalid size paramater passed");
    }
}

/**
 * Returns the percentage of the overflow in one direction.
 *
 * @public
 * @param {SIZE} size which size to check
 * @returns {number}
 * @throws {TypeError} if an invalid size is passed
 */
export function getOverflowInPercentage(size) {
    switch (size) {
    case SIZE.WIDTH: {
        const overflow = getOverflowInPixels(SIZE.WIDTH);
        return overflow / document.documentElement.scrollWidth * 100;
    } case SIZE.HEIGHT: {
        const overflow = getOverflowInPixels(SIZE.HEIGHT);
        return overflow / document.documentElement.scrollHeight * 100;
    } default:
        throw new TypeError("invalid size paramater passed");
    }
}
