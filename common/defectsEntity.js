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

    //updates status for this table. ought to be moved to a central npm
    async markStatusLocked(data) {
        let query = { Id: BaseEntity.prototype.DEFECTSTATUSID };
        this._locked = true;
        let result = await this._status.find(query).toArray();
        if (result.length === 0) {//need to insert, lock and move forward
            let recordObj = {
                Id: BaseEntity.prototype.DEFECTSTATUSID,
                //Title: data.title,
                locked: Constants.REMOTELOCK
            };
            await this._status.insertOne(recordObj);
            this._logger.log('status not found, inserting');
            //compare the one passed in with the one in the db
        } else if (result[0].Title !== data.title) {
            this._logger.log('different title obtaind. going for lock and update');

            if (!this.isStatusLocked(result[0])) {
                await BaseEntity.updateRecord({ Id: BaseEntity.prototype.DEFECTSTATUSID }, { locked: Constants.REMOTELOCK }, this._status)
                this._logger.log('status locked');
            } else {
                this._locked = false;
                this._logger.log('already locked. Cant proceed');
            }

        } else {
            this._locked = false;
            this._logger.log('stale entry found');
        }
        return this._locked;
    }

    isStatusLocked(statusRecord) {
        return (statusRecord.locked && statusRecord.locked !== Constants.REMOTELOCK)

    }
    //used to lock as well unlock. for now, being used for unlock only
    async unlockStatus(data) {
        if (this._locked) {
            this._logger.log('unlocking status');
            await BaseEntity.updateRecord({ Id: BaseEntity.prototype.DEFECTSTATUSID }, { "Title": data.title, locked: '' }, this._status);
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