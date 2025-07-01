const User = require("../models/user")
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const sendgridTransport = require("nodemailer-sendgrid-transport")
// sendgridTransport = require('nodemailer-sendgrid-transport')
// 3QC82K1GPLSQHPUF3V8765QZ //snd grid key
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: { api_key: '' }
}))
exports.getLogin = (req, res, next) => {
    // console.log("error message", req.flash('error'))
    let message = req.flash('error')
    message = message.length > 0 ? message[0] : null;
    res.render('./auth/login', {
        title: 'Login',
        path: '/login',
        errorMessage: message,
        validationMsg: [],
        oldInput: { email: '', password: '' },
        // hasProduct: products.length > 0,
        // activeShop: true,
        // productCss: true
    })
}
exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password
    const error = validationResult(req)

    if (!error.isEmpty()) {
        return res.status(422).render('./auth/login', {
            title: 'Login',
            path: '/login',
            errorMessage: error.array()[0].msg,
            oldInput: { email: email, password: password },
            validationMsg: error.array()
        })
    }
    // console.log('req body', req.body)
    User.findOne({ email: email }).then(user => {
        if (!user) {
            console.log('wrong user')
            req.flash('error', "Invalid Emial or Password")
            return res.redirect('/login')
        }
        // console.log('compare user')
        bcrypt.compare(password, user.password)
            .then(doMatch => {
                // return res.redirect()
                if (doMatch) {
                    req.session.isLoggedIn = true
                    req.session.user = user
                    return req.session.save((err) => {
                        res.redirect('/')
                        // return transporter.sendMail({
                        //     to: email,
                        //     from: 'shop@node-complete.com',
                        //     subject: 'Login Successfully!',
                        //     html: '<p>Hi Avanish you are logged in'
                        // }).catch(err => {
                        //     console.log('send mail error', err)
                        // })
                    })
                }
                req.flash('error', "Invalid Emial or Password")
                return res.redirect('/login')
            })

    }).catch(err => {
        // console.log('user find error', err);
        return res.redirect('/login')
    })
}
exports.postLogout = (req, res, next) => {
    // console.log('logout')
    req.session.destroy(() => {
        res.redirect('/')
    })
}
exports.getSignUp = (req, res, next) => {
    let message = req.flash('error')
    console.log('sign up error ,essage', message)
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('./auth/signup', {
        title: 'SignUp',
        path: '/signup',
        errorMessage: message,
        oldInput: { name: '', email: '', password: '', confirmPassword: '' },
        validationMsg: []

        // hasProduct: products.length > 0,
        // activeShop: true,
        // productCss: true
    })
}
exports.postSignUp = (req, res, next) => {
    const error = validationResult(req)
    const name = req.body.name
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    console.log('error post login', error.array())
    if (!error.isEmpty()) {
        return res.status(422).render('./auth/signup', {
            title: 'SignUp',
            path: '/signup',
            errorMessage: error.array()[0].msg,
            oldInput: { name: name, email: email, password: password, confirmPassword: confirmPassword },
            validationMsg: error.array()
            // hasProduct: products.length > 0,
            // activeShop: true,
            // productCss: true
        })
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            // transporter.sendMail()
            return newUser.save();
        }).then(result => {
            res.redirect('/login')
        })


    // console.log('email', req.body)
    // // console.log('logout')
    // // req.session.destroy(() => {
    // res.redirect('/')
    // // })
}
exports.getReset = (req, res, next) => {
    let message = req.flash('error')
    message = message.length > 0 ? message[0] : null;
    res.render('./auth/reset', {
        title: 'Reset Password',
        path: '/reset',
        errorMessage: message
        // hasProduct: products.length > 0,
        // activeShop: true,
        // productCss: true
    })
}
exports.postReset = (req, res, next) => {
    const email = req.body.email
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        console.log("token", token)
        User.findOne({ email: email }).then(user => {
            if (!user) {
                req.flash('error', "No account found with that email!")
                return res.redirect('/reset')
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
        }).then(result => {
            res.redirect('/')
            transporter.sendMail({
                to: email,
                from: 'shop@node-complete.com',
                subject: 'Reset password',
                html: `
                <You requested a reset password
                <p>Click this <a href="http:localhost:3002/reset/${token}" target="_blank">Link</a> to reset your password</p>
                `
            }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error)
            })
        })
    })
}
exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                console.log('reset', user)
                return res.redirect('/reset')
            }
            let message = req.flash('error')
            message = message.length > 0 ? message[0] : null;
            res.render('./auth/new-password', {
                title: 'New Password',
                errorMessage: message,
                path: '/new-password',
                userId: user._id.toString(),
                token: token
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
exports.postNewPassword = (req, res, next) => {
    const password = req.body.password
    const userId = req.body.userId;
    const token = req.body.token;
    // console.log('reset password', req.body)
    let newUser;
    User.findOne({ _id: userId, resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.redirect('./login')
            }
            newUser = user;
            return bcrypt.hash(password, 12)
        }).then(hashPassword => {
            newUser.password = hashPassword;
            newUser.resetToken = undefined;
            newUser.resetTokenExpiration = undefined
            return newUser.save()
        }).then(result => {
            res.redirect('/login')
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error)
        })
}