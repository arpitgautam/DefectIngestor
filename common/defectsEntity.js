const Constants = require('./constants');
const BaseEntity = require('./baseEntity');

class DefectsEntity extends BaseEntity{

    constructor(url) {
        super(url);
        this._locked = false;

    }

    async init() {
        await super.init();
        this._status = this._db.collection('Status');
        this._defects = this._db.collection('Defects');
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
                await BaseEntity.updateRecord({ Id: '1' }, { locked: Constants.LOCK },this._status)
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
    //used to lock as well unlock. for now, being used for unlock only
    async lockStatus(lock,data) {
        if (this._locked) {
            await BaseEntity.updateRecord({ Id: '1' }, {"Title": data.title, locked: '' },this._status);
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