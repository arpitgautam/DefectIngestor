import RSSManager from './rssmanager.mjs';
import enums from './enums.mjs';
import Logger from './logger.mjs';
import RSSParser from './rssparser.mjs';
import DBManager from './dbmanager.mjs';
import Constants from './constants.mjs';

class Controller {

    async run() {
        let logger = new Logger();
        try {
            logger.log('Starting to get RSS feed');
            let rssManager = new RSSManager();
            let rssParser = new RSSParser();
            let rssData = await rssManager.fetch(enums.RSSSource.LOCAL);
            logger.log('RSS feed done');
            let dataObject = rssParser.parse(rssData);
            logger.log('RSS feed parsed');
            //saving to aws dynamodb
            let dbUrl = undefined;
            let region = 'ap-south-1';
            if(Constants.DEVMODE === true){
                dbUrl = 'http://localhost:8000';
                region = 'local';
            }
            let dbmanager = new DBManager(region, dbUrl);
            const results = await dbmanager.putItems(dataObject);
        } catch (err) {
            logger.log(err);
        }
    }
}

export default Controller;