const MongoClient = require('mongodb');

const Logger = require('./logger');


class BaseEntity{

    constructor(url){
        this._url = url;
        this._logger = new Logger();

    }

    async init(){
        this._connection = await MongoClient.connect(this._url);
        this._db = this._connection.db('scalert');
    }

    async close() {
        await this._connection.close();
    }

    static async updateRecord(query, update,collection) {
        let updateObj = {
            $set: update,
            $currentDate: { lastModified: true }
        }
        await collection.updateOne(query, updateObj);
    }

}

module.exports = BaseEntity;