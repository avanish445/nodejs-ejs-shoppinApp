const express = require('express');
// const path = require('path');
const adminData = require('./admin')
const router = express.Router()
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')



router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:productId', shopController.getProductById)
router.get('/cart', isAuth, shopController.getCart)
router.post('/cart', isAuth, shopController.postCart)
router.post('/delete-cart', isAuth, shopController.deleteCart)
router.post('/create-order', isAuth, shopController.postCreateOrder)
router.get('/checkout', shopController.getCheckout)
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders)
router.get('/invoice/:orderId', isAuth, shopController.getProductInvoice)


module.exports = router