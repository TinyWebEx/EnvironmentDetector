/**
 * Example popup file for testing module.
 *
 * @requires ../../EnvironmentDetector
 */

import * as EnvironmentDetector from "../../EnvironmentDetector.js";

/**
 * Wait for a defined amount of time (and optionally) do something afterwards.
 *
 * @function
 * @param {int} timeInMs the time to wait
 * @param {function} doAfterwards a function to execute afterwards
 * @returns {void}
 */
export function wait(timeInMs, doAfterwards) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doAfterwards);
        }, timeInMs);
    });
}

/**
 * Insert text into HTMl page.
 *
 * @private
 * @param {string} text
 * @param {boolean} [lineBreak=true] whether to add a line break
 * @param {string} [element="div"] element tag
 * @returns {void}
 */
function addText(text, lineBreak = true, element = "div") {
    const div = document.createElement(element);
    div.textContent = text;
    document.body.appendChild(div);

    if (lineBreak) {
        document.body.appendChild(document.createElement("br"));
    }
}

/**
 * Run it.
 *
 * @private
 * @returns {void}
 */
function analyse() {
    addText(`inner size: ${window.innerWidth}x${window.innerHeight}`);
    addText(`scroll size: ${document.body.scrollWidth}x${document.body.scrollHeight}`);
    addText(`pageOverflows: ${EnvironmentDetector.pageOverflows()}`);
    addText(`pageOverflows width: ${EnvironmentDetector.pageOverflows(EnvironmentDetector.SIZE.WIDTH)}`);
    addText(`pageOverflows height: ${EnvironmentDetector.pageOverflows(EnvironmentDetector.SIZE.HEIGHT)}`);
    addText(`isPopup: ${EnvironmentDetector.isPopup()}`);
    addText(`getPopupType: ${EnvironmentDetector.getPopupType().toString()}`);
    const popupSize = EnvironmentDetector.getPopupSize();
    addText(`getPopupSize: ${popupSize.width.toString()}x${popupSize.height.toString()}`);
}

addText("EnvironmentDetector test popup", true, "b");
// need to wait, because popup initializes at 0px size
// analyse(); // you can use this to test it
wait(200).then(analyse);
