const session = require('express-session');
const Order = require('../models/order');
const Product = require('../models/products');
const path = require('path');
const fs = require('fs');
const rootDir = require('../utils/path')
const PDFDocument = require('pdfkit');
const stripe = require('stripe')('sk_test_51RYrx9E09a6IHgXJvUIkSOUEeXYyUArxGOmJEoNvjBrxv3zDOZggJZIuEQchrsDnPSbGkyW8EhtFStWBPnp8nnTi00NpTCcJJZ')
const ITEMS_PER_PAGE = 3;

exports.postCreateOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(cart => {
                console.log('product details', cart)
                return {
                    product: { ...cart.productId._doc },
                    quantity: cart.quantity
                }
            });
            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user
                },
            })
            return order.save();
        }).then(result => {
            return req.user.clearCart()
        }).then(result => {
            res.redirect('/orders')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
    // console.log('create order')
}

exports.getIndex = (req, res, next) => {
    // console.log('sessions', req)
    const page = +req.query.page || 1;
    let totalCount = 0;
    console.log('producr page', page)
    Product.count().then(prodCount => {
        totalCount = prodCount;
        return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    }).then(products => {
        console.log('products', products)
        res.render('./shop/index', {
            title: 'My Shop List',
            products: products,
            path: '/',
            totalItems: totalCount,
            hasNextPage: page * ITEMS_PER_PAGE < totalCount,
            hasPrevPage: page > 1,
            totalPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
            currentPage: page
            // hasProduct: products.length > 0,
            // activeShop: true,
            // productCss: true
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    });
}

exports.getProducts = (req, res, next) => {
    // console.log('admin data', products)
    const page = +req.query.page || 1;
    let totalCount = 0;
    Product.count().then(prodCount => {
        totalCount = prodCount
        return Product.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    }).then(products => {
        // console.log(products)
        res.render('./shop/product-list', {
            title: 'My Shop List',
            products: products,
            path: '/products',
            totalItems: totalCount,
            hasNextPage: page * ITEMS_PER_PAGE < totalCount,
            hasPrevPage: page > 1,
            totalPage: Math.ceil(totalCount / ITEMS_PER_PAGE),
            currentPage: page
            // hasProduct: products.length > 0,
            // activeShop: true,
            // productCss: true
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })
}

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId
    console.log('get product id ', productId)
    Product.findById(productId).then(product => {
        res.render('./shop/product-details', {
            title: product.title,
            product: product,
            path: '/products',
            // hasProduct: products.length > 0,
            // activeShop: true,
            // productCss: true
        })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })
}
exports.getCart = (req, res, next) => {
    console.log('entered into get cart', req.user)
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            console.log('cart products', user.cart.items)
            console.log('cart item', user)
            res.render('./shop/cart', {
                title: 'My Cart',
                products: user.cart.items,
                path: '/cart',
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
}

exports.postCart = (req, res, next) => {
    console.log('add to cart result')
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product)
        }).then(result => {
            // console.log('add to cart result', result)
            res.redirect('/cart');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
}

exports.deleteCart = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteCartById(prodId).then(resp => {
        res.redirect('/cart');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error)
    })

}


exports.getCheckoutSuccess = (req, res, next) => {
    // req.user
    //     .populate('cart.items.productId')
    //     .execPopulate()
    //     .then(user => {
    //         const products = user.cart.items.map(i => {
    //             return { quantity: i.quantity, product: { ...i.productId._doc } };
    //         });
    //         const order = new Order({
    //             user: {
    //                 email: req.user.email,
    //                 userId: req.user
    //             },
    //             products: products
    //         });
    //         return order.save();
    //     })
    //     .then(result => {
    //         return req.user.clearCart();
    //     })
    //     .then(() => {
    //         res.redirect('/orders');
    //     })
    //     .catch(err => {
    //         const error = new Error(err);
    //         error.httpStatusCode = 500;
    //         return next(error);
    //     });
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(cart => {
                console.log('product details', cart)
                return {
                    product: { ...cart.productId._doc },
                    quantity: cart.quantity
                }
            });
            const order = new Order({
                products: products,
                user: {
                    name: req.user.name,
                    userId: req.user
                },
            })
            return order.save();
        }).then(result => {
            return req.user.clearCart()
        }).then(result => {
            res.redirect('/orders')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
};

exports.getCheckout = (req, res, next) => {
    // console.log('admin data', products)
    // Product.fetchAll((products) => {
    //     console.log('product details', products)
    let products;
    let total = 0
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            console.log('cart products', user.cart.items)
            console.log('cart item', user)
            total = user.cart.items.reduce((acc, cur) => acc + cur.productId.price * cur.quantity, 0)
            products = user.cart.items
            // console.log('total price', totalPrice)

            return stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: products.map(p => {
                    return {
                        price_data: {
                            currency: "inr",
                            unit_amount: p.productId.price * 100,
                            product_data: {
                                name: p.productId.title,
                                description: p.productId.description,
                                // images: '',
                            },
                        },
                        quantity: p.quantity,
                    }
                }),
                mode: 'payment',
                success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
                cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
            })
        }).then(session => {
            res.render('./shop/checkout', {
                title: 'My Checkout',
                products: products,
                path: '/checkout',
                totalPrice: total,
                sessionId: session.id
            })
        }).catch(err => {
            console.log('checkout error', err)
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            console.log('orders', orders)
            res.render('./shop/orders', {
                title: 'My Orders',
                orders: orders,
                path: '/orders',
                // hasProduct: products.length > 0,
                // activeShop: true,
                // productCss: true
            })
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
    // console.log('order details')

}
exports.getProductInvoice = (req, res, next) => {
    const prodId = req.params.orderId
    Order.findById(prodId)
        .then(order => {
            // console.log('new orders', order)
            if (!order) {
                return next(new Error('No order found'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }
            const invoiceName = `invoice-${prodId}.pdf`
            const newPath = path.join(rootDir, 'data', 'invoices', invoiceName)
            // for small file
            // fs.readFile(newPath, (err, data) => {
            //     if (err) {
            //         console.log(err)
            //         return next(err)
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'inline; filename=' + invoiceName + '')
            //     res.send(data)
            // })
            // for large file
            // const file = fs.createReadStream(newPath)
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename=' + invoiceName + '')
            // file.pipe(res)
            // Generate pdf on demand
            const doc = new PDFDocument()
            doc.pipe(fs.createWriteStream(newPath));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=' + invoiceName + '')
            doc.pipe(res);
            doc.fontSize(25).text("Invoive", { underline: true })
            doc.text('-----------------------------------------')
            console.log('order', order.products[0].product)
            let total = 0;
            order.products.forEach(prod => {
                total += prod.product.price * prod.quantity
                doc.fontSize(16).text(`${prod.product.title} - ${prod.product.price} X ${prod.quantity} - Rs: ${prod.product.price * prod.quantity}`)
                doc.text('-----------------------------------------')
            });
            doc.fontSize(20).text(`Total --------------- Rs: ${total}`)
            doc.end();
        })
        .catch(err => {
            return next(err)
        })

    // console.log('product id', prodId)
}
