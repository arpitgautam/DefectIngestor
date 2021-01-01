//give an ability to enter users
//process those to enter libraries collection



// to be modified for calling from a REST endpoint
let handler = async function (event, context) {
    console.log("EVENT: \n" + JSON.stringify(event, null, 2))

    console.log('devmode:' + Constants.DEVMODE);
    let controller = new Controller;
    await controller.addUser( {
        Email: "arpit@abc.com",
        Libraries: [ "Corretto", "JBoss" ],
    
      });
   //await controller.addUser();
   // await controller.addUser();
    if (!Constants.DEVMODE) {
        return context.logStreamName

    }
}

exports.handler = handler;
if (Constants.DEVMODE){
    handler();
}


