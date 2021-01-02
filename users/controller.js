
const UserEntity = require('../common/userEntity');
const LibraryEntity = require('../common/libraryEntity');
const Logger = require('../common/logger');

class Controller {

    constructor() {

    }

    async run(users) {

        const mongoURL = process.env.MONGO_URL;
        const userEntity = new UserEntity(mongoURL);
        const libraryEntity = new LibraryEntity(mongoURL);
        const logger = new Logger();
        try {
            await userEntity.init();
            await userEntity.updateUser(users);

            //TODO - start transcation here
            await libraryEntity.init();
            await libraryEntity.updateLibraries(users);
            //update library collection
            await userEntity.close();
            await libraryEntity.close();

        } catch (err) {
            logger.log(err);
            if (userEntity) {
                await userEntity.close();
            }
            if(libraryEntity){
                await libraryEntity.close();
            }
        }

    }
}

module.exports = Controller;