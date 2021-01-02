
const Controller = require('./controller');
const Constants = require('../common/constants');
const Utilities = require('../common/utilities');


Utilities.setDevMode();

let handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    console.log('devmode:' + Constants.DEVMODE);
    let controller = new Controller;
    await controller.run();
    if (!Constants.DEVMODE) {
        return context.logStreamName

    }
}

exports.handler = handler;
if (Constants.DEVMODE){
    handler();
}
