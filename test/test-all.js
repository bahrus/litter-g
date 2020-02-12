const xt = require('xtal-test/index');
(async () => {
    const passed = await xt.runTests([
        {
            path: 'test/fly-g.html',
            expectedNoOfSuccessMarkers: 3,
        },
    ]);
    if (passed) {
        console.log("Tests Passed.  Have a nice day.");
    }
})();
