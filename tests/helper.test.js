import "https://unpkg.com/mocha@5.2.0/mocha.js"; /* globals mocha */
import "https://unpkg.com/chai@4.1.2/chai.js"; /* globals chai */
import "https://unpkg.com/sinon@6.1.5/pkg/sinon.js"; /* globals sinon */

import * as Helper from "../internal/Helper.js";

describe("common module: EnvironmentDetector - Helper", function () {
    describe("isSameSizeWithScrollbar()", function () {
        it("correct result without toolbar", function () {
            chai.assert.strictEqual(
                Helper.isSameSizeWithScrollbar(200, 200),
                true
            );
        });

        it("correct result on Windows", function () {
            chai.assert.strictEqual(
                Helper.isSameSizeWithScrollbar(200, 217),
                true
            );
        });

        it("returns false, when parameters are switched", function () {
            chai.assert.strictEqual(
                Helper.isSameSizeWithScrollbar(217, 200), // first param is withOUT toolbar!
                false
            );
        });

        it("returns false, when diff is too large", function () {
            chai.assert.strictEqual(
                Helper.isSameSizeWithScrollbar(200, 230),
                false
            );
        });
    });

    describe("approxCompare()", function () {
        it("exact comparison works", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 100),
                true
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 100.0),
                true
            );
        });

        it("exact comparison fails for different values", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 101),
                false
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 100.1),
                false
            );
        });

        it("absolute difference comparison works", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {absolute: 20}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {absolute: 20}),
                true
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {absolute: 20.0}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {absolute: 20.0}),
                true
            );
        });

        it("absolute difference comparison fails for different values", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {absolute: 19}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {absolute: 19}),
                false
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {absolute: 19.9}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {absolute: 19.9}),
                false
            );
        });

        it("relative difference comparison works", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {relative: 0.20}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {relative: 0.17}),
                true
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {relative: 0.20}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {relative: 0.17}),
                true
            );
        });

        it("relative difference comparison fails for different values", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {relative: 0.19}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {relative: 0.16}), // because it's relative to 120
                false
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {relative: 0.199}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {relative: 0.165}), // because it's relative to 120
                false
            );
        });

        it("relative difference comparison works for num2 as reference", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {relativeTo: "num2", relative: 0.20}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {relativeTo: "num2", relative: 0.17}),
                true
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {relativeTo: "num2", relative: 0.20}),
                true
            );
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {relativeTo: "num2", relative: 0.17}),
                true
            );
        });

        it("relative difference comparison fails for different values for num2 as reference", function () {
            chai.assert.strictEqual(
                Helper.approxCompare(120, 100, {relativeTo: "num2", relative: 0.19}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(100, 120, {relativeTo: "num2", relative: 0.16}), // because it's relative to 120
                false
            );

            // float
            chai.assert.strictEqual(
                Helper.approxCompare(120.0, 100.0, {relativeTo: "num2", relative: 0.199}),
                false
            );
            chai.assert.strictEqual(
                Helper.approxCompare(100.0, 120.0, {relativeTo: "num2", relative: 0.165}), // because it's relative to 120
                false
            );
        });
    });
});
