const Sequalizer = require('sequelize');
const sequalizer = require('../utils/database');
const CartItem = sequalizer.define('cartItem', {
    id: {
        type: Sequalizer.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequalizer.INTEGER
    }
})
module.exports = CartItem
// const path = require('path');
// const fs = require('fs');
// const rootDir = require('../utils/path')
// const newPath = path.join(rootDir, 'data', 'cart.json')

// module.exports = class Cart {
//     static addProduct(id, price) {
//         fs.readFile(newPath, (err, fileContent) => {
//             let cart = { products: [], totalPrice: 0 }
//             if (!err) {
//                 cart = JSON.parse(fileContent)
//             }
//             console.log("file cart", cart, err)
//             const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
//             console.log('existing product', existingProductIndex)
//             let existingProduct = cart.products[existingProductIndex]
//             let updatedProduct;
//             if (existingProduct) {
//                 updatedProduct = { ...existingProduct }
//                 updatedProduct.qty = updatedProduct.qty + 1;
//                 cart.products = [...cart.products];
//                 cart.products[existingProductIndex] = updatedProduct
//             } else {
//                 updatedProduct = { id: id, qty: 1 }
//                 cart.products = [...cart.products, updatedProduct]
//             }
//             cart.totalPrice = cart.totalPrice + +price;
//             console.log('cart', cart)
//             // cart.products[existingProductIndex] = updatedProduct;
//             fs.writeFile(newPath, JSON.stringify(cart), err => {
//                 console.log('error', err)
//             })
//         })
//     }
//     static deleteCart(id, price) {
//         fs.readFile(newPath, (err, fileContent) => {
//             if (err) {
//                 return
//             }
//             const cart = JSON.parse(fileContent);
//             let updatedCart = { ...cart };
//             const existingCart = updatedCart.products.find(prod => prod.id == id);
//             if (!existingCart) return;
//             const quantity = existingCart.qty;
//             updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
//             updatedCart.totalPrice = updatedCart.totalPrice - price * quantity;
//             fs.writeFile(newPath, JSON.stringify(updatedCart), err => {
//                 console.log('error', err)
//             })
//         })
//     }
//     static getCartProduct(callback) {
//         fs.readFile(newPath, (err, fileContent) => {
//             const cart = JSON.parse(fileContent);
//             if (err) {
//                 return callback([])
//             } else {
//                 callback(cart)
//             }
//         })
//     }
// }