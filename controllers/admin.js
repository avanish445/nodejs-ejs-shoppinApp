const { validationResult } = require('express-validator');
const Product = require('../models/products');
const { fileHelper } = require('../utils/file');
const ITEMS_PER_PAGE = 3;
exports.postEditProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const productId = req.body.productId
    const image = req.file
    // console.log('product id', productId)
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(422).render('./admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: true,
            errorMessage: error.array()[0].msg,
            product: {
                title: title,
                price: price,
                description: description,
                _id: productId
            },
            // activeProduct: true,
            // formCss: true
        })
    }
    // console.log(productId)
    Product.findById(productId).then(product => {
        if (product.userId.toString() !== req.user._id.toString()) {
            console.log('not same')
            return res.redirect('/')
        }
        product.title = title
        product.price = price
        product.description = description
        if (image) {
            fileHelper(product.imageUrl)
            product.imageUrl = image.path
        }
        product.save().then(resp => {
            // console.log('updated product', resp)
            res.redirect('/admin/products')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
    })


}
exports.getAddProduct = (req, res, next) => {
    console.log('Add product')
    res.render('./admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: ''
        // activeProduct: true,
        // formCss: true
    })
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId
    console.log("product id", prodId)
    if (!prodId) {
        return res.redirect('/')
    }
    Product.findById(prodId).
        then(product => {
            // console.log('products', product)
            res.render('./admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: true,
                product: product,
                errorMessage: ''
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file
    console.log('file', image)
    // return
    if (!image) {
        return res.status(422).render('./admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            editing: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Not a valid image file type',
            // activeProduct: true,
            // formCss: true
        })
    }
    const error = validationResult(req)
    console.log('product add error', error)
    if (!error.isEmpty()) {
        return res.status(422).render('./admin/edit-product', {
            title: 'Add Product',
            path: '/admin/add-product',
            editing: false,
            errorMessage: error.array()[0].msg,
            // activeProduct: true,
            // formCss: true
        })
    }
    const imageUrl = image.path
    const product = new Product(
        {
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl,
            userId: req.user._id
        }
    )
    product.save().then(resp => {
        console.log('result new', resp)
        res.redirect('/admin/products')
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })
}

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalCount = 0;
    Product.count().then(prodCount => {
        totalCount = prodCount;
        return Product.find({ userId: req.user._id }).skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    }).then(products => {
        console.log('products', products)
        res.render('./admin/admin-products', {
            title: 'My Product List',
            products: products,
            path: '/admin/products',
            totalItems: totalCount,
            hasNextPage: page * ITEMS_PER_PAGE < totalCount,
            hasPrevPage: page > 1,
            totalPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
            currentPage: page
            // hasProduct: products.length > 0,
            // activeShop: true,
            // productCss: true
        })
        // console.lo
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })
}

exports.postDeleteProducts = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId).then(product => {
        if (!product) {
            return next(new Error('Product not found'))
        }
        fileHelper(product.imageUrl)
        return Product.deleteOne({ userId: req.user._id, _id: prodId })
    }).then(resp => {
        console.log('delete resp', resp)
        res.redirect('/admin/products')
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })
}