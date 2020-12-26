import RSSManager from './rssmanager.mjs';
import enums from './enums.mjs';
import Logger from './logger.mjs';
import RSSParser from './rssparser.mjs';

class Controller{

    async run(){
        let logger = new Logger();
        logger.log('Starting to get RSS feed');
        let rssManager = new RSSManager();
        let rssParser = new RSSParser();
        let rssData = await rssManager.fetch(enums.RSSSource.LOCAL);
        logger.log('RSS feed done');
        let dataObject = rssParser.parse(rssData);
        logger.log('RSS feed parsed');
        console.log(dataObject);
        //saving to aws dynamodb
    
    }
}

export default Controller;