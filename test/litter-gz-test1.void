import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;
const test = require('tape');
import { Page } from "puppeteer"; //typescript
import { Test } from "tape";
async function customTests(page: Page) {
    await page.waitFor(4000);
    const textContent = await page.$eval('a', (c: any) => c.href);
    console.log(textContent);
    const TapeTestRunner = {
        test: test
    } as Test;
    TapeTestRunner.test('testing litter-gz-test.html', (t: any) => {
        t.equal(textContent, 'http://www.gps-coordinates.org/my-location.php?lat=41.903878&lng=12.452818');
        t.end();
    });

}

(async () => {
    await xt.runTests({
        path: 'demo/litter-gz-test.html'
    }, customTests);
})();