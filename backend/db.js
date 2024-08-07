const {MongoClient} = require ('mongodb')

let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect('mongodb+srv://huthayfashaheen:SIGMASH2003@sls.bamewgg.mongodb.net/SLS')
        .then((client) => {
           dbConnection = client.db()
           return cb()
        })
        .catch(err => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}