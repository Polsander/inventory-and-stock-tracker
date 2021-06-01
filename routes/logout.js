const express = require('express');
const router = express.Router();
const logout = require('../controllers/logout');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

router.get('/logout', logout.logoutUser);

module.exports = router;