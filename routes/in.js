
const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const Log = require('../models/logs');
const User = require('../models/user');

const ExpressError = require('../utilities/ExpressError');
//controller
const inShipment = require('../controllers/in');
//middleware
const {isLoggedIn, validateUser} = require('../middleware')


// joi schema middleware to be used
const {inAndOutUnitSchema, inAndOutCabinetSchema} = require('../schemas');

const validateCabinetIn = (req, res, next) => {
    const {error} = inAndOutCabinetSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};

const validateUnitIn = (req, res, next) => {
    const {error} = inAndOutUnitSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};

//----------------
//route handling

router.get('/in', isLoggedIn, validateUser, inShipment.selectScreen);

router.get('/in/cabinets', validateUser, catchAsync(inShipment.getCabinetPage));

router.put('/in/cabinets', validateUser, validateCabinetIn, catchAsync(inShipment.sendInCabinets));

router.get('/in/units', validateUser, catchAsync(inShipment.getUnitPage));

router.put('/in/units', validateUser, validateUnitIn, catchAsync(inShipment.sendInUnits));

module.exports = router;