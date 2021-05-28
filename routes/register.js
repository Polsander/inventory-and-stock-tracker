const express = require('express');
const router = express.Router();
const User = require('../models/user');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// Validation middleware - ensuring no blank registration submissions
const {signupSchema} = require('../schemas');

const validateRegister = (req, res, next) => {
    const {error} = signupSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};


// Routes
router.get('/register', (req, res) => {
    res.render('users/register')
});

router.post('/register', validateRegister, catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logout();
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'User Successfully Registered')
            res.redirect('/');
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

}));

module.exports = router;