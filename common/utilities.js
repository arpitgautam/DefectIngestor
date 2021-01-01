
const Constants = require('./constants');

class Utilities {

    static setDevMode() {
        if (process.argv.length > 2 && process.argv[2] === '-devmode') {
            Constants.DEVMODE = true;
        }
    }


}

module.exports = Utilities;
