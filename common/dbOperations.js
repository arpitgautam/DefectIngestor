
class DBOperations{

    static async updateRecord(query, update,collection) {
        let updateObj = {
            $set: update,
            $currentDate: { lastModified: true }
        }
        await collection.updateOne(query, updateObj);
    }

}

module.exports = DBOperations;