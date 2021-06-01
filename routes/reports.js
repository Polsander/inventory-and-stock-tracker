const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const reports = require('../controllers/reports');

//middleware
const {isLoggedIn, validateAdmin, validateSuperAdmin} = require('../middleware')


router.get('/reports', isLoggedIn, validateAdmin, catchAsync(reports.renderReports));

router.delete('/reports/delete/:logId/:userId/', 
isLoggedIn, 
validateSuperAdmin, 
catchAsync(reports.deleteReport));


module.exports = router;