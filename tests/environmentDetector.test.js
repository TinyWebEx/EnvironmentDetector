import "https://unpkg.com/mocha@5.2.0/mocha.js"; /* globals mocha */
import "https://unpkg.com/chai@4.1.2/chai.js"; /* globals chai */
import "https://unpkg.com/sinon@6.1.5/pkg/sinon.js"; /* globals sinon */

import * as EnvironmentDetector from "../EnvironmentDetector.js";

describe("common module: EnvironmentDetector", function () {
    describe("isSameSizeWithScrollbar()", function () {
        it("loads managed options", function () {
            chai.assert.strictEqual(
                EnvironmentDetector.isSameSizeWithScrollbar(217, 200), // NOT EXPOTTZED
                true
            );
        });
    });
});
