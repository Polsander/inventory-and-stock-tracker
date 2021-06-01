const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const register = require('../controllers/register');


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
router.get('/register', register.getRegisterPage);

router.post('/register', validateRegister, catchAsync(register.registerNewUser));

module.exports = router;