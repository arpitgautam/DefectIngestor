const RSSManager = require('./rssmanager');
const Enums = require('../common/enums');
const Logger = require('../common/logger');
const RSSParser = require('./rssparser');
const Constants = require('../common/constants');
const DefectsEntity = require('../common/defectsEntity');

class Controller {

    async run() {
        let logger = new Logger();
        let db;
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
            let canproceed = await db.updateStatus(dataObject);
            if (!canproceed) {
                //remove all records from collection and insert new ones
                await db.removeAllDefects();
                await db.insertDefects(dataObject);
                await db.lockStatus(false);
            }
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