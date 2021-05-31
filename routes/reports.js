const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

const Log = require('../models/logs');
const User = require('../models/user');

//middleware
const {isLoggedIn, validateAdmin, validateSuperAdmin} = require('../middleware')


router.get('/reports', isLoggedIn, validateAdmin, catchAsync(async(req,res) => {
    const logs = await Log.find({}).populate({path: 'users'})
    res.render ('reports/index', {logs})
}));

router.delete('/reports/delete/:logId/:userId/', isLoggedIn, validateSuperAdmin, catchAsync(async(req,res) => {
    await User.findByIdAndUpdate(req.params.userId, { $pull: {logs: req.params.logId}});
    await Log.findByIdAndDelete(req.params.logId);
    res.redirect('/reports')
}));


module.exports = router;