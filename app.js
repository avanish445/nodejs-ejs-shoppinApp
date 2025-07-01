const express = require('express')
const app = express();
const path = require('path');
var util = require('util');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)
var encoder = new util.TextEncoder('utf-8');
const csrf = require('csurf')
const flash = require('connect-flash');

const mongooseConnection = require('./utils/database').mongooseConnection

const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin');
const shop = require('./routes/shop');
const authRoute = require('./routes/auth')
const pageNotFound = require('./controllers/404')
// const Products = require('./models/products');
const User = require('./models/user');
const multer = require('multer');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');
const fileStorge = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const MONGODB_URI = 'mongodb+srv://avanish:jsr1052@cluster0.y0wr0.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0'
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProperties = csrf();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorge, fileFilter: fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'my-secret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProperties);
app.use(flash())



app.use((req, res, next) => {
    // throw new Error('dummy')
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id).then(user => {
        // console.log('user details', user)
        // throw new Error('dummy')
        if (!user) {
            return next()
        }
        req.user = user
        next()
    }).catch(err => {
        next(new Error(err))
    })
})

app.use((req, res, next) => {
    res.locals.authenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

// ejs view engine
app.set('view engine', 'ejs');
app.set('views', 'views')

// handle bar view engine
// app.engine('hbs', handlebars({ layoutsDir: 'views/layouts/layouts-hbs', defaultLayout: 'main-layout', extname: 'hbs' }))
// app.set('view engine', 'hbs');
// app.set('views', 'views')

// pug view engine 
// app.set('view engine', 'pug');
// app.set('views', 'views')



app.use('/admin', adminRoutes)
app.use(shop)
app.use(authRoute)

app.use('/500', pageNotFound.get500)

app.use((error, req, res, next) => {
    res.status(500).render('500',
        {
            title: 'Error!',
            path: '/500',
            authenticated: req.session.isLoggedIn,
            // csrfToken: req.csrfToken()
        })
    // console.log('user', req)
    // console.log('error', error)
    // res.redirect('/500')
})
app.use(pageNotFound.pageNotFound)





// console.log('errr')
// { force: true }
mongooseConnection(MONGODB_URI, () => {
    // console.log('client', client);
    // const user = new User({
    //     name: 'Avanish',
    //     email: 'Avanishpatel445@gmail.com',
    //     cart: { items: [] }
    // })
    app.listen(3002)
    // user.save()
})
// app.listen(3002, () => {
//     console.log(`Server listening on port`);
// })
