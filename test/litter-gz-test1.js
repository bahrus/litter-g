var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const xt = require('xtal-test/index');
const test = require('tape');
function customTests(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.waitFor(4000);
        const textContent = yield page.$eval('a', (c) => c.href);
        console.log(textContent);
        const TapeTestRunner = {
            test: test
        };
        TapeTestRunner.test('testing litter-gz-test.html', (t) => {
            t.equal(textContent, 'http://www.gps-coordinates.org/my-location.php?lat=41.903878&lng=12.452818');
            t.end();
        });
    });
}
(() => __awaiter(this, void 0, void 0, function* () {
    yield xt.runTests({
        path: 'demo/litter-gz-test.html'
    }, customTests);
}))();
//# sourceMappingURL=litter-gz-test1.js.map