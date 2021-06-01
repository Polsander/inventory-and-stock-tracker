const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');

//controller
const out = require('../controllers/out');
//middleware
const {isLoggedIn, validateUser} = require('../middleware');


router.get('/out', isLoggedIn, validateUser, out.selectScreen);

router.get('/out/cabinets', isLoggedIn, validateUser, catchAsync(out.getCabinetPage));

router.put('/out/cabinets', isLoggedIn, validateUser, catchAsync(out.sendCabinetOut));

router.get('/out/units', isLoggedIn, validateUser, catchAsync(out.getUnitPage));

router.put('/out/units', isLoggedIn, validateUser, catchAsync(out.sendUnitOut));

module.exports = router;