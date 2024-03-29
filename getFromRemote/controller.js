const RSSManager = require('./rssmanager');
const Enums = require('../common/enums');
const Logger = require('../common/logger');
const RSSParser = require('./rssparser');
const Constants = require('../common/constants');
const DefectsEntity = require('../common/defectsEntity');

class Controller {

    async run() {
        let logger = new Logger();
        let db,locked=false;
        try {
            logger.log('Starting to get RSS feed');
            let rssManager = new RSSManager();
            let rssParser = new RSSParser();
            let rssData = await rssManager.fetch(Enums.RSSSource.LOCAL);
            logger.log('RSS feed done');
            let dataObject = rssParser.parse(rssData);
            logger.log('RSS feed parsed');
            //saving to mongo
            const mongoURL = process.env.MONGO_URL;
            db = new DefectsEntity(mongoURL);
            await db.init();
            //start transcation here or inside the entity
            locked = await db.markStatusLocked(dataObject,Constants.REMOTELOCK);
            if (locked) {
                //remove all records from collection and insert new ones
                await db.removeAllDefects();
                await db.insertDefects(dataObject);
                await db.unlockStatus(dataObject);
            }
            //end trascation here
            await db.close();

        } catch (err) {
            logger.log(err);
            if(locked && db){
                await db.unlockStatus(dataObject);
            }
            if (db) {
                await db.close();
            }

           
        }
    }
}

module.exports = Controller;