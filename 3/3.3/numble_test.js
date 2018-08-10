let flow = require('nimble')

flow.series([
    function (callback) {
        setTimeout(() => {
            console.log('first')
            callback()
        }, 1000);
    },
    function (callback) {
        setTimeout(() => {
            console.log('sencond')
            callback()
        }, 500);
    },
    function (callback) {
        setTimeout(() => {
            console.log('last')
            callback()
        }, 100);
    }
])