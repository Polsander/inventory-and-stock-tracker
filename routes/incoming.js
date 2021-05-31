
const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const Log = require('../models/logs');
const User = require('../models/user');

const ExpressError = require('../utilities/ExpressError');

//middleware
const {isLoggedIn, validateUser} = require('../middleware')


// schema middleware to be used
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


router.get('/incoming', isLoggedIn, validateUser, (req,res) => {
    res.render('incoming/select')
});

router.get('/incoming/cabinets', validateUser, catchAsync(async(req,res) => {
    const cabinets = await Cabinet.find({})
    res.render('incoming/cabinets', {cabinets});
}));

router.put('/incoming/cabinets', validateUser, validateCabinetIn, catchAsync(async(req,res) => {
    const [cabinet] = await Cabinet.find({name: req.body.cabinet.name});
    await Cabinet.updateOne({name: req.body.cabinet.name}, {langley: parseFloat(cabinet.langley) + parseFloat(req.body.cabinet.langley)});
    const currentUser = await User.findById(req.user._id);
    const log = new Log({message: `+${req.body.cabinet.langley} (${cabinet.name}) cabinets incoming to Langley`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    req.flash('success', 'Incoming Cabinets Documented')
    res.redirect('/incoming/cabinets');
}));

router.get('/incoming/units', validateUser, catchAsync(async(req,res) => {
    const units = await Unit.find({});
    res.render('incoming/units', {units});
}));

router.put('/incoming/units', validateUser, validateUnitIn, catchAsync(async(req,res) => {
    const [unit] = await Unit.find({name: req.body.unit.name});
    const updatedUnit =
    await Unit.updateOne({name: req.body.unit.name}, {langley: parseFloat(unit.langley) + parseFloat(req.body.unit.langley)});
    const currentUser = await User.findById(req.user._id)
    const log = new Log({message: `+${req.body.unit.langley} (${unit.name}) units incoming to Langley`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    req.flash('success', 'Incoming Units Documented');
    res.redirect('/incoming/units');
}));

module.exports = router;