const Constants = require('./constants');
const BaseEntity = require('./baseEntity');

class DefectsEntity extends BaseEntity {

    constructor(url) {
        super(url);
        this._locked = false;
        BaseEntity.prototype.DEFECTSTATUSID = 'defects';

    }

    async init() {
        await super.init();
        this._status = this._db.collection('Status');
        this._defects = this._db.collection('Defects');
    }

    async lockStatus(lockString) {
        if (!this._locked) {
            let query = { Id: BaseEntity.prototype.DEFECTSTATUSID };
            let result = await this._status.find(query).toArray();
            if (result.length === 0) {
                this._logger.log('no status found. Create a record manually first');
                this._locked = true;
            } else {
                this._checkAndLock(result,lockString);
            }
        } else {
            this._locked = false;
            this._logger.log('unable to lock status, already locked');
        }
        return this._locked;

    }
    //updates status for this table. ought to be moved to a central npm
    async markStatusLocked(data, lockString) {
        let query = { Id: BaseEntity.prototype.DEFECTSTATUSID };
        this._locked = true;
        let result = await this._status.find(query).toArray();
        if (result.length === 0) {//need to insert, lock and move forward
            let recordObj = {
                Id: BaseEntity.prototype.DEFECTSTATUSID,
                //Title: data.title,
                locked: lockString
            };
            await this._status.insertOne(recordObj);
            this._logger.log('status not found, inserting');
            //compare the one passed in with the one in the db
        } else if (result[0].Title !== data.title) {
            this._logger.log('different title obtained. going for lock and update');
            await this._checkAndLock(result,lockString);

        } else {
            this._locked = false;
            this._logger.log('stale entry found');
        }
        return this._locked;
    }

    async _checkAndLock(result,lockString) {
        if (!this.isStatusLocked(result[0],lockString)) {
            await BaseEntity.updateRecord({ Id: BaseEntity.prototype.DEFECTSTATUSID }, { locked: lockString }, this._status)
            this._locked = true;
            this._logger.log('status locked');
        } else {
            this._locked = false;
            this._logger.log('already locked. Cant proceed');
        }
    }

    isStatusLocked(statusRecord,lockString) {
        return (statusRecord.locked && statusRecord.locked !== lockString)

    }
    //used to lock as well unlock. for now, being used for unlock only
    async unlockStatus(data) {
        if (this._locked) {
            let recordToUpsert = { locked: '' };
            if (data && data.title) {
                recordToUpsert.Title = data.title;
            }
            this._logger.log('unlocking status');
            await BaseEntity.updateRecord({ Id: BaseEntity.prototype.DEFECTSTATUSID }, recordToUpsert, this._status);
            this._logger.log('status unlocked');
        }

    }

    async readAllDefects() {
        return this._defects.find({}).toArray();
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