//use dev_mode for dev only settings in command line


import Controller from './controller.mjs'
import Constansts from './constants.mjs'

(async () => {
    if(process.argv.length >2 && process.argv[2] === '-devmode'){
        Constansts.DEVMODE = true;
    }
    console.log('devmode:' + Constansts.DEVMODE);
    let controller = new Controller;
    await controller.run();
})();

