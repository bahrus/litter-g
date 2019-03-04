const xt = require('xtal-test/index');
const test = require('tape');
async function customTests(page) {
    await page.waitFor(4000);
    const textContent = await page.$eval('#pronouns>li#li_3', (c) => c.innerText);
    const TapeTestRunner = {
        test: test
    };
    TapeTestRunner.test('testing dev.html', (t) => {
        t.equal(textContent, 'Ze');
        t.end();
    });
}
(async () => {
    await xt.runTests({
        path: 'demo/dev.iife.html'
    }, customTests);
})();
