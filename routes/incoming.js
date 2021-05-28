
const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');

const ExpressError = require('../utilities/ExpressError');


// middleware to be used
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


router.get('/incoming', (req,res) => {
    res.render('incoming/select')
});

router.get('/incoming/cabinets', catchAsync(async(req,res) => {
    const cabinets = await Cabinet.find({})
    res.render('incoming/cabinets', {cabinets});
}));

router.put('/incoming/cabinets', validateCabinetIn, catchAsync(async(req,res) => {
    const [cabinet] = await Cabinet.find({name: req.body.cabinet.name});
    await Cabinet.updateOne({name: req.body.cabinet.name}, {langley: parseFloat(cabinet.langley) + parseFloat(req.body.cabinet.langley)});
    req.flash('success', 'Incoming Cabinets Documented')
    res.redirect('/incoming/cabinets');
}));

router.get('/incoming/units', catchAsync(async(req,res) => {
    const units = await Unit.find({});
    res.render('incoming/units', {units});
}));

router.put('/incoming/units', validateUnitIn, catchAsync(async(req,res) => {
    const [unit] = await Unit.find({name: req.body.unit.name});
    await Unit.updateOne({name: req.body.unit.name}, {langley: parseFloat(unit.langley) + parseFloat(req.body.unit.langley)});
    req.flash('success', 'Incoming Units Documented');
    res.redirect('/incoming/units');
}))

module.exports = router;