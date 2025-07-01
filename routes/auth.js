const express = require('express')
const User = require("../models/user")
// const path = require('path')
const routes = express.Router();
const { check, body } = require('express-validator')
const auth = require('../controllers/auth')
// const rootDir = require('../utils/path')

routes.get('/login', auth.getLogin)
routes.post('/login', [
    check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password', 'Please enter password with only number, text and at least 5 character')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], auth.postLogin)
routes.post('/logout', auth.postLogout)
routes.post('/signup',
    [
        check('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(user => {
                    if (user) {
                        return Promise.reject('Email already exist, please pick a different one')
                    }
                })
            }),
        body('password', 'Please enter password with only number, text and at least 5 character')
            .isLength({ min: 5 })
            .isAlphanumeric().trim(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password is not matching')
            }
            return true
            // console.log('confirmPassword', value, req.body)
        }).trim()

    ], auth.postSignUp)
routes.get('/signup', auth.getSignUp)
routes.get('/reset', auth.getReset)
routes.post('/reset', auth.postReset)
routes.get('/reset/:token', auth.getNewPassword)
routes.post('/new-password', auth.postNewPassword)

module.exports = routes