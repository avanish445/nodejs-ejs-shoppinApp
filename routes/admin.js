const express = require('express')
const isAuth = require('../middleware/is-auth')
// const path = require('path')
const routes = express.Router();
const adminController = require('../controllers/admin');
const { body } = require('express-validator');
// const rootDir = require('../utils/path')

routes.get('/add-product', isAuth, adminController.getAddProduct)
routes.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
routes.post('/edit-product', [
    body('title').isString().isLength({ min: 3 }).trim().withMessage('Invalid Product title'),
    body('description').isString().trim()
], isAuth, adminController.postEditProduct)
routes.get('/products', isAuth, adminController.getProducts)
routes.post('/add-product', [
    body('title').isString().isLength({ min: 3 }).trim().withMessage('Invalid Product title'),
    body('description').isString().trim()
], isAuth, adminController.postAddProduct)
routes.post('/delete-product', isAuth, adminController.postDeleteProducts)
module.exports = routes