const DefectsEntity = require('../common/defectsEntity');
const Logger = require('../common/logger');
const Constants = require('../common/constants');

//if not locked, lock it with your name
//take top x entries not processed yet from libraries table
//process them, mark them, go for repeat


class Controller {
    async run() {
        let logger = new Logger();
        let db, locked = false;

        try {
            const mongoURL = process.env.MONGO_URL;
            db = new DefectsEntity(mongoURL);
            await db.init();
            locked = await db.lockStatus(Constants.CHECKLOCK);
            if (!locked) {
                const defects = await db.readAllDefects();
                logger.log('all defects read, going for unlock');
                await db.unlockStatus();//pass lock string here and in another lambda too
            }
            //get first 10 libraries
            //process 10 libraries
            //mark them as processed



            await db.close();


        } catch (err) {
            logger.log(err);

            if (db) {
                await db.close();
            }

        }
    }
}

module.exports = Controller;