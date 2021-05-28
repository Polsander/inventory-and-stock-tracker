const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

router.get('/login', (req,res) => {
    res.render('users/login');
});

router.post('/login', 
passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
async(req,res) => {
    const redirectUrl = req.session.returnTo || '/';
    req.flash('success','Successfully Logged In');
    res.redirect(redirectUrl);
});

module.exports = router;