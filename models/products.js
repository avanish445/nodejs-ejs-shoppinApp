const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Product', productSchema);
// // const Sequalizer = require('sequelize');
// // const sequalizer = require('../utils/database')
// const MongoDb = require('mongodb')
// const getDb = require('../utils/database').getDb
// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title
//         this.price = price
//         this.description = description
//         this.imageUrl = imageUrl
//         this._id = id ? new MongoDb.ObjectId(id) : ''
//         this.userId = userId
//     }
//     save() {
//         const db = getDb()
//         console.log(this)
//         let dbOp;
//         if (this._id) {
//             dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
//         } else {
//             dbOp = db.collection('products').insertOne({
//                 title: this.title,
//                 price: this.price,
//                 description: this.description,
//                 imageUrl: this.imageUrl,
//                 userId: this.userId
//             })
//         }
//         return dbOp.then(resp => {
//             console.log('result', resp)
//         }).catch(err => {
//             console.log('error', err)
//         })
//     }
//     static fetchAll() {
//         const db = getDb()
//         return db.collection('products').find().toArray()
//             .then(products => {
//                 console.log('products', products)
//                 return products
//             }).catch(err => {
//                 console.log('product fetch error', err)
//             })
//     }
//     static findById(prodId) {
//         const db = getDb()
//         return db.collection('products').find({ _id: new MongoDb.ObjectId(prodId) }).next()
//             .then(product => {
//                 console.log('single products', product)
//                 return product
//             }).catch(err => {
//                 console.log('product fetch error', err)
//             })
//     }
//     static deleteById(prodId) {
//         const db = getDb()
//         return db
//             .collection('products')
//             .deleteOne({ _id: new MongoDb.ObjectId(prodId) })
//             .then(resp => {
//                 console.log('delete resp', resp);
//             })
//             .catch(err => {
//                 console.log('delete error', err)
//             })
//     }
// }
// module.exports = Product;
