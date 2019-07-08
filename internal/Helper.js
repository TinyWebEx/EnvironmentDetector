/**
 * Internal helper functions.
 *
 * @package
 * @module EnvironmentDetector
 */

/**
 * Check whether size equals, when we remove the size for a scroll bar.
 *
 * @package
 * @param {number} withoutScrollbar size without a scrollbar
 * @param {number} withScrollbar size with a scrollbar
 * @returns {boolean}
 */
export function isSameSizeWithScrollbar(withoutScrollbar, withScrollbar) {
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
 * Compare the two numbers approximately and returns true, if they are
 * approximately the same.
 *
 * @package
 * @param {number} num1
 * @param {number} num2
 * @param {Object} diff either absolute or relative must be given
 * @param {number} [diff.absolute] absolute difference to allow
 * @param {number} [diff.relative] relative difference to allow (relative to num1)
 * @param {"num1"|"num2"} [diff.relativeTo="num1"] relative to which number the
 *                      percentage should be calculated
 * @returns {boolean}
 */
export function approxCompare(num1, num2, diff = {}) {
    let isSimilar = false;

    // if exactly the same, quick return
    if (num1 === num2) {
        return true;
    }

    if (diff.absolute) {
        const absDiff = Math.abs(num1 - num2);
        isSimilar = isSimilar || (absDiff <= diff.absolute);
    }

    if (diff.relative) {
        const referenceValue = (diff.relativeTo === "num2" ? num2 : num1);
        const compareValue = (diff.relativeTo === "num2" ? num1 : num2);
        const min = referenceValue * (1 - diff.relative);
        const max = referenceValue * (1 + diff.relative);

        isSimilar = isSimilar || (
            compareValue >= min &&
            compareValue <= max
        );
    }

    return isSimilar;
}
