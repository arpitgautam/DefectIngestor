const MongoClient = require('mongodb');

const Logger = require('./logger');
const Constants = require('./constants');
const DBOperations = require('./dbOperations');

class DefectsEntity {

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

    //updates status for this table. ought to be moved to a central npm
    async updateStatus(data) {
        let query = { Id: '1' };
        let canproceed = false;
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
                await DBOperations.updateRecord({ Id: '1' }, { "Title": data.title, locked: Constants.LOCK },this._status)
                this._locked = true;
                this._logger.log('status locked');
            } else {
                canproceed = true;
                this._logger.log('already locked. Cant proceed');
            }

        } else {
            canproceed = true;
            this._logger.log('stale entry found');
        }

        return canproceed;
    }

    isStatusLocked(statusRecord) {
        return (statusRecord.locked && statusRecord.locked !== Constants.LOCK)

    }
    async lockStatus(lock) {
        if (this._locked) {
            await DBOperations.updateRecord({ Id: '1' }, { locked: '' },this._status);
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

}

module.exports = DefectsEntity;