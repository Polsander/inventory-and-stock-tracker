const express = require('express');
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

//controller
const login = require('../controllers/login');

router.get('/login', login.renderLogin );

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), 
catchAsync(login.loginUser));

module.exports = router;