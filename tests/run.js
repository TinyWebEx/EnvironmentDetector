import "https://unpkg.com/mocha@5.2.0/mocha.js"; /* globals mocha */

/* tests */
import "./environmentDetector.test.js";

mocha.checkLeaks();
mocha.run();
