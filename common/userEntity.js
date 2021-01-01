const BaseEntity = require('./baseEntity');

class UserEntity extends BaseEntity {
    constructor(url) {
        super(url);
    }

    async init() {
        await super.init();
        this._users = this._db.collection('Users');
    }

    async updateUser(user) {
        this._logger.log('updating user:' + user.Email);
        await this._users.updateMany(
            {Email: user.Email},
            { $set: user},
            { upsert: true }
        );
        this._logger.log('user updated');

    }


}

module.exports = UserEntity;