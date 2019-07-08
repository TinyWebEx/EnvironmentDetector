/**
 * Caching wrapper for AddonSettings API that does save and load settings.
 *
 * @module EnvironmentDetector
 */

import * as Helper from "./internal/Helper.js";

export const POPUP_TYPE = {
    OVERFLOW: Symbol("overflow menu popup"),
    USUAL: Symbol("usual browser button popup")
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

/**
 * Returns the popup environment this is running in.
 *
 * @public
 * @returns {Object|null}
 */
export function getPopupType() {
    if (
        window.innerWidth === 348
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
 * Returns whether we are running in a popup.
 *
 * @todo needs testing
 * @public
 * @returns {boolean}
 */
export function isPopup() {
    // window.outer* is the size of the main Firfox window
    // If window.inner* is significantly smaller, this may be a popup.

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
        doesOverflow = doesOverflow || (document.documentElement.scrollWidth > document.documentElement.clientWidth);
    }
    if (!size || size === SIZE.HEIGHT) {
        doesOverflow = doesOverflow || (document.documentElement.scrollHeight > document.documentElement.clientHeight);
    }

    return doesOverflow;
}
