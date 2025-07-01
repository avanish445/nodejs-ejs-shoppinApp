const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true },
                quantity: {
                    type: Number,
                    require: true
                }
            }
        ]
    }
})

UserSchema.methods.addToCart = function (product) {
    console.log('this cart', this)
    // const newCart = this.cart?.items
    const updatedCartItems = [...this.cart.items]
    // console.log('updatedCartItems', updatedCartItems)
    const cartProductIndex = updatedCartItems.findIndex(cart => cart.productId.toString() === product._id.toString())
    // return cartProduct;
    // console.log(updatedCartItems, cartProductIndex, product._id)
    let newCartQuantity = 1;
    if (cartProductIndex >= 0) {
        newCartQuantity = updatedCartItems[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newCartQuantity
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newCartQuantity })
    }
    // console.log('updated cart', updatedCartItems)
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart;
    return this.save();
}

UserSchema.methods.deleteCartById = function (cartId) {
    const cartItems = [...this.cart.items];
    const newCartItems = cartItems.filter(i => i.productId.toString() !== cartId);
    this.cart.items = newCartItems;
    return this.save();
}

UserSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save();
}

module.exports = mongoose.model('User', UserSchema)

// const MongoDb = require('mongodb')
// const getDb = require('../utils/database').getDb
// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : { items: [] };
//         this._id = id
//     }
//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//     }
//     addToCart(product) {
//         const updatedCartItems = [...this.cart.items];
//         const cartProductIndex = updatedCartItems.findIndex(cart => cart.productId.toString() === product._id.toString())
//         // return cartProduct;
//         // console.log(updatedCartItems, cartProductIndex, product._id)
//         let newCartQuantity = 1;
//         if (cartProductIndex >= 0) {
//             newCartQuantity = updatedCartItems[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newCartQuantity
//         } else {
//             updatedCartItems.push({ productId: new MongoDb.ObjectId(product._id), quantity: newCartQuantity })
//         }
//         // console.log('updated cart', updatedCartItems)
//         const updatedCart = { items: updatedCartItems }
//         const db = getDb();
//         return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
//     }
//     getCart() {
//         console.log('entered  get cart', this.cart)
//         const db = getDb();
//         const cartItems = [...this.cart.items];
//         const productIds = cartItems.map(i => i.productId);
//         return db.collection('products').find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     return { ...product, quantity: cartItems.find(cart => cart.productId.toString() === product._id.toString()).quantity }
//                 })
//             })
//     }
//     deleteCartById(cartId) {
//         // console.log('entered  get cart')
//         console.log('cart id', cartId)
//         const cartItems = [...this.cart.items];
//         const newCartItems = cartItems.filter(i => i.productId.toString() !== cartId);
//         const db = getDb();
//         const updatedCart = { items: newCartItems }
//         return db.collection('users').updateOne({ _id: new MongoDb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
//         // console.log('new cart items', newCartItems);
//     }
//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: this._id,
//                     name: this.name
//                 }
//             }
//             return db.collection('orders')
//                 .insertOne(order)
//                 .then(result => {
//                     this.cart = { items: [] }
//                     return db.collection('users')
//                         .updateOne({ _id: new MongoDb.ObjectId(this._id) }, { $set: { cart: { items: [] } } })
//                 })
//         })

//     }
//     getOrders() {
//         const db = getDb()
//         return db.collection('orders').find({ 'user._id': new MongoDb.ObjectId(this._id) }).toArray();
//     }
//     static findById(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new MongoDb.ObjectId(userId) })
//     }
// }
// module.exports = User