import RSSManager from './rssmanager.mjs';
import enums from './enums.mjs';
import Logger from './logger.mjs';
import RSSParser from './rssparser.mjs';
import Constants from './constants.mjs';
import Database from './database.mjs';

class Controller {

    async run() {
        let logger = new Logger();
        let db;
        try {
            logger.log('Starting to get RSS feed');
            let rssManager = new RSSManager();
            let rssParser = new RSSParser();
            let rssData = await rssManager.fetch(enums.RSSSource.LOCAL);
            logger.log('RSS feed done');
            let dataObject = rssParser.parse(rssData);
            logger.log('RSS feed parsed');
            //saving to mongo
            db = new Database('mongodb://localhost:27017/');
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

export default Controller;