class Constants{
    constructor(){
        this.RSS_FILE_NAME = 'latest_rss.txt';
        this.META_FILE_NAME='metadata/libraries.txt';
        this.DEVMODE = false;
        this.REMOTELOCK = 'getFromRemote';
    }

}

let constants = new Constants();

module.exports = constants;