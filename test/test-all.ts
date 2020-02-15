import { IXtalTestRunner, IXtalTestRunnerOptions } from 'xtal-test/index.js';
const xt = require('xtal-test/index') as IXtalTestRunner;


(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-g.html',
            expectedNoOfSuccessMarkers: 9,

        },
    ]);
    if(passed){
        console.log("Tests Passed.  Have a nice day.");
    }
})();

