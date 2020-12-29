const RSSManager = require('./rssmanager.js');
const Enums = require('./enums.js');
const Logger = require('./logger.js');
const RSSParser = require('./rssparser.js');
const Constants = require('./constants.js');
const Database = require('./database.js');

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
            db = new Database(mongoURL);
            await db.init();
            let staleEntryFound = await db.updateNonStaleStatus(dataObject);
            if (!staleEntryFound) {
                //remove all records from collection and insert new ones
                await db.removeAllDefects();
                await db.insertDefects(dataObject);

            }
            await db.close();

        } catch (err) {
            if (db) {
                await db.close();
            }
            logger.log(err);
        }
    }
}

module.exports = Controller;