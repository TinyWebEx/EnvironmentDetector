/**
 * Caching wrapper for AddonSettings API that does save and load settings.
 *
 * @module EnvironmentDetector
 */

export const POPUP_TYPE = {
    OVERFLOW: Symbol("overflow menu popup"),
    USUAL: Symbol("usual browser button popup")
};

export const POPUP_SIZE = {
    MAX: Symbol("maxiumum value")
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
 * Check whether size equals, when we remove the size for a scroll bar.
 *
 * @private
 * @param {number} withoutScrollbar size without a scrollbar
 * @param {number} withScrollbar size with a scrollbar
 * @returns {boolean}
 */
function isSameSizeWithScrollbar(withoutScrollbar, withScrollbar) {
    // Windows scroll bar: 14px
    // Mac OS: 0px (not visible)
    // allow ~20px for scrollbar
    const SCROLL_TOLERANCE = 20; // TODO: make this os-dependent

    return (
        withoutScrollbar >= (withScrollbar - SCROLL_TOLERANCE) &&
        withoutScrollbar <= withScrollbar
    );
}

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
    return ((
        pageOverflows(SIZE.WIDTH) ?
            isSameSizeWithScrollbar(screen.availWidth, window.outerWidth) :
            screen.availWidth === window.outerWidth
    ) && (
        pageOverflows(SIZE.HEIGHT) ?
            isSameSizeWithScrollbar(screen.availHeight, window.outerHeight) :
            screen.availHeight === window.outerHeight
    ));
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
