const BaseEntity = require('./baseEntity');

class UserEntity extends BaseEntity {
    constructor(url) {
        super(url);
    }

    async init() {
        await super.init();
        this._libraries = this._db.collection('Libraries');
    }

    async updateLibraries(user) {
        this._logger.log('updating libraries:' + user.Email);
       //enter a row for every library, 
       for(let library of user.Libraries){
        await this._libraries.updateOne(
            {Library: library},
            { $addToSet: {Email:user.Email}},
            { upsert: true }
        );

       }
        this._logger.log('libraries updated');

    }


}

module.exports = UserEntity;