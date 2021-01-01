
const UserEntity = require('../common/userEntity');

class Controller {

    constructor() {

    }

    async run(users) {

        const mongoURL = process.env.MONGO_URL;
        const userEntity = new UserEntity(mongoURL);
        try {
            await userEntity.init();
            await userEntity.updateUser(users);
            //update library collection
            await userEntity.close();

        } catch (err) {
            if (userEntity) {
                await userEntity.close();
            }
        }

    }
}

module.exports = Controller;