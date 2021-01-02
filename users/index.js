//give an ability to enter users
//process those to enter libraries collection

const Constants = require('../common/constants');
const Utilities = require('../common/utilities');
const Controller = require('./controller');

Utilities.setDevMode();

// to be modified for calling from a REST endpoint
//not supporting updating email id for now
let handler = async function (event, context) {

    console.log('devmode:' + Constants.DEVMODE);
    let controller = new Controller();
    let dummyData = [
        {
            Email: "arpit@abc.com",
            Libraries: ["Corretto", "JBoss","struts","gitlab","wireshark"],

        },
        {
            Email: "albert@abc.com",
            Libraries: ["Corretto", "JBoss", "nginix","vscode","mongo","gitlab"],

        },
        {
            Email: "pinto@abc.com",
            Libraries: ["OpenFire", "Node","struts","httpclient","log4j", "log4j2","wireshark"],

        }
    ];

    for (const entry of dummyData) {
        await controller.run(entry);
    }
    
    if (!Constants.DEVMODE) {
        return context.logStreamName

    }
}

exports.handler = handler;
if (Constants.DEVMODE) {
    handler();
}


