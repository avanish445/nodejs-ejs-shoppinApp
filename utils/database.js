// const mongoose = require('mongoose')
const mongoose = require('mongoose');
// const MongoClient = mongodb.MongoClien
// let _db;
const mongooseConnection = (URI, callback) => {
    mongoose.connect(URI)
        .then(client => {
            console.log('connnected!')
            // _db = client.db()
            callback()
        }).catch(err => {
            console.log('connection error', err)
        })
}
const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'Db connsction failed!'
}
exports.mongooseConnection = mongooseConnection
exports.getDb = getDb

