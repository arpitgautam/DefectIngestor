
class Controller {

    constructor() {
        const _mongoURL = process.env.MONGO_URL;
        const _db = new Database(mongoURL);
    }

    async addUser(user) {
        //update user collection
        //update library collection



    }
}

module.exports = Controller;