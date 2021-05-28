const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');


router.get('/outgoing' ,(req,res) => {
    res.render('outgoing/select')
});

router.get('/outgoing/cabinets', catchAsync(async(req,res) => {
    const cabinets = await Cabinet.find({});
    res.render('outgoing/cabinets', {cabinets});
}));

router.put('/outgoing/cabinets', catchAsync(async(req,res) => {
    const [cabinet] = await Cabinet.find({name: req.body.cabinet.name});
    const updatedCab =
        await Cabinet.findByIdAndUpdate(cabinet._id, {langley: (parseFloat(cabinet.langley) - parseFloat(req.body.cabinet.langley))});
    const updatedCab2 =
        await Cabinet.findByIdAndUpdate(cabinet._id, {nakusp: parseFloat(cabinet.nakusp) + parseFloat(req.body.cabinet.langley)});
    await updatedCab.save();
    await updatedCab2.save();
    res.redirect('/outgoing/cabinets')
}));

router.get('/outgoing/units', catchAsync(async(req,res) => {
    const units = await Unit.find({});
    res.render('outgoing/units', {units});
}));

router.put('/outgoing/units', catchAsync(async(req,res) => {
    const [unit] = await Unit.find({name: req.body.unit.name});
    const updatedUnit = 
        await Unit.findByIdAndUpdate(unit._id, {langley: parseFloat(unit.langley) - parseFloat(req.body.unit.langley)});
    await updatedUnit.save();
    res.redirect('/outgoing/units');
}))

module.exports = router;