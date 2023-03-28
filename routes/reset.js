const express = require('express');
const router = express.Router();
const reset = require('../controllers/reset');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//sg = new SendGrid(System.getenv('EMAIL_API_KEY'))

//Validation Middleware - Protect blank submissions from happening
const {resetPasswordSchema} = require('../schemas');


const validatePasswordReset = (req, res, next) => {
    const {error} = resetPasswordSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};



//Routes

router.get('/forgot', reset.getResetForm);

router.post('/forgot', catchAsync( reset.forgotPasswordSubmissionSIB));

router.post('/forgot/:username', catchAsync( reset.forgotPasswordSubmissionAdmin));

router.get('/reset-password/:id/:token', catchAsync(reset.renderResetPassword));

router.post('/reset-password/:id/:token', validatePasswordReset, catchAsync(reset.resetUserPassword));

module.exports = router