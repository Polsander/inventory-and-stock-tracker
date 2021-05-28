const express = require('express');
const router = express.Router();

const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

//middleware
const {cabinetSchema, unitSchema} = require('../schemas.js')
const {isLoggedIn, validateUser, validateAdmin, validateSuperAdmin} = require('../middleware');


const validateUnit = (req, res, next) => {
    const {error} = unitSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw( new ExpressError(msg, 400))
    }
    else {
        next();
    }
};


//These are the routes for units below
router.get('/', isLoggedIn, validateUser, catchAsync(async(req,res) => {
    const cabinets = await Cabinet.find({}).populate('units')
    res.render('units/index', {cabinets});
}));

router.get('/new', validateSuperAdmin, catchAsync(async(req,res) => {
    const cabinets = await Cabinet.find({})
    res.render('units/new', {cabinets})
}));

router.post('/', validateUnit, validateSuperAdmin, catchAsync(async(req,res) => {
    const findCabinet = await Cabinet.find({name: req.body.cabinet.name})
    const unit = new Unit(req.body.unit);
    const cabinet = findCabinet[0]
    cabinet.units.push(unit);
    await unit.save();
    await cabinet.save();
    req.flash('success', 'Successfully Added A Unit')
    res.redirect('/units');
}));

router.get('/:id', validateUser, catchAsync(async(req,res) => {
    const findCabinet = await Cabinet.find({units: req.params.id})
    const cabinet = findCabinet[0]
    const unit = await Unit.findById(req.params.id)
    res.render('units/show',{cabinet, unit})
}));

//edit route

router.get('/:id/edit', validateSuperAdmin, catchAsync(async(req,res) => {
    const unit = await Unit.findById(req.params.id)
    const cabinets = await Cabinet.find({})
    const cabinet = await Cabinet.find({units: req.params.id})
    const originalCabinet = cabinet[0]
    res.render('units/edit', {unit, cabinets, originalCabinet})
}));

router.put('/:id/edit/:cabinetId', validateUnit, validateSuperAdmin, catchAsync(async(req,res) => {
    const unit = await Unit.findByIdAndUpdate(req.params.id, {...req.body.unit});
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: {units: req.params.id}});
    const findCabinet = await Cabinet.find({name: req.body.cabinet.name});
    const cabinet = findCabinet[0];
    cabinet.units.push(unit);
    await unit.save();
    await cabinet.save();
    req.flash('success', 'Successfully updated Unit')
    res.redirect(`/units/${unit._id}`);
}));

// delete route
router.delete('/:id/cabinets/:cabinetId', validateSuperAdmin, catchAsync(async(req,res) => {
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: {units: req.params.id}});
    await Unit.findByIdAndDelete(req.params.id);
    req.flash('warning', 'Unit Deleted')
    res.redirect('/units');
}));

module.exports = router;