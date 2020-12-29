//use dev_mode for dev only settings in command line


const Controller = require('./controller.js');
const Constansts = require('./constants.js');

if (process.argv.length > 2 && process.argv[2] === '-devmode') {
    Constansts.DEVMODE = true;
}

let handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))


    console.log('devmode:' + Constansts.DEVMODE);
    let controller = new Controller;
    await controller.run();
    if (!Constansts.DEVMODE) {
        return context.logStreamName

    }
}

exports.handler = handler;
if (Constansts.DEVMODE){
    handler();
}
