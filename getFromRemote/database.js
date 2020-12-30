const MongoClient = require('mongodb');

const Logger = require('./logger.js');
const Constants = require('./constants.js');

class Database {

    constructor(url) {

        this._url = url;
        this._logger = new Logger();
        this._locked = false;

    }

    async init() {
        this._connection = await MongoClient.connect(this._url);

        this._db = this._connection.db('scalert');

        this._status = this._db.collection('Status');
        this._defects = this._db.collection('Defects');
    }

    async close() {
        await this._connection.close();
    }

    //checks status collection to see if there is a record in there
    //if there is a record in there, it is compared with data passed in
    //in case of same data, it is staled
    async updateNonStaleStatus(data) {
        let query = { Id: '1' };
        let staleEntryFound = false;
        let result = await this._status.find(query).toArray();
        if (result.length === 0) {
            let recordObj = {
                Id: '1',
                Title: data.title,
                locked: Constants.LOCK
            };
            await this._status.insertOne(recordObj);
            this._logger.log('status not found, inserting');
            //compare the one passed in with the one in the db
        } else if (result[0].Title !== data.title) {

            if (!this.isStatusLocked(result[0])) {
                await this._updateRecord({ Id: '1' }, { "Title": data.title, locked: Constants.LOCK })
                this._locked = true;
                this._logger.log('status locked');
            } else {
                staleEntryFound = true;
                this._logger.log('already locked. Cant proceed');
            }

        } else {
            staleEntryFound = true;
            this._logger.log('stale entry found');
        }

        return staleEntryFound;
    }

    isStatusLocked(statusRecord) {
        return (statusRecord.locked && statusRecord.locked !== Constants.LOCK)

    }
    async lockStatus(lock) {
        if (this._locked) {
            await this._updateRecord({ Id: '1' }, { locked: '' });
            this._logger.log('status unlocked');
        }

    }


    async removeAllDefects() {
        this._logger.log('removing all defects');
        this._defects.deleteMany({});
    }

    async insertDefects(defects) {
        let dbObjects = defects.container.map((defect) => {
            return defect.adaptForDB();
        });
        await this._defects.insertMany(dbObjects);
        console.log('defects inserted');
    }


    async _updateRecord(query, update) {
        let updateObj = {
            $set: update,
            $currentDate: { lastModified: true }
        }
        await this._status.updateOne(query, updateObj);
    }


}

module.exports = Database;