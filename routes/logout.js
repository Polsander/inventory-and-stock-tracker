const express = require('express');
const router = express.Router();
const User = require('../models/user');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

module.exports = router;