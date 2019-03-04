const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    await page.waitFor(4000);
    const textContent = await page.$eval('a', (c) => c.href);
    console.log(textContent);
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing litter-gz-test.html', (t) => {
        t.equal(textContent, 'http://www.gps-coordinates.org/my-location.php?lat=41.903878&lng=12.452818');
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'demo/litter-gz-test.html'
    }, customTests);
})();
