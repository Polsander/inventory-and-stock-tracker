const express = require('express');
const router = express.Router();

const catchAsync = require('../utilities/catchAsync');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const User = require('../models/user');
const Log = require('../models/logs');
const ExpressError = require('../utilities/ExpressError');



router.get('/outgoing', (req, res) => {
    res.render('outgoing/select')
});

router.get('/outgoing/cabinets', catchAsync(async (req, res) => {
    const cabinets = await Cabinet.find({});
    res.render('outgoing/cabinets', { cabinets });
}));

router.put('/outgoing/cabinets', catchAsync(async (req, res) => {
    const [cabinet] = await Cabinet.find({ name: req.body.cabinet.name });
    if (req.body.cabinet.langley > cabinet.langley) {
        throw new ExpressError('Sending out too large of a quantity', 403);
    }
    const updatedCab =
        await Cabinet.findByIdAndUpdate(cabinet._id,
            {
                langley: (parseFloat(cabinet.langley) - parseFloat(req.body.cabinet.langley)),
                nakusp: (parseFloat(cabinet.nakusp) + parseFloat(req.body.cabinet.langley))
            }
        );
    const currentUser = await User.findById(req.user._id);
    const log = new Log({message: `-${req.body.cabinet.langley} (${cabinet.name}) cabinets outgoing to Nakusp`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    await updatedCab.save();
    req.flash('success', 'Outgoing Cabinets Documented')
    res.redirect('/outgoing/cabinets')
}));

router.get('/outgoing/units', catchAsync(async (req, res) => {
    const units = await Unit.find({});
    res.render('outgoing/units', { units });
}));

router.put('/outgoing/units', catchAsync(async (req, res) => {
    const [unit] = await Unit.find({ name: req.body.unit.name });
    if (req.body.unit.langley > unit.langley) { 
        throw new ExpressError('Sending out too large of a quantity', 403);
    }
    const updatedUnit =
        await Unit.findByIdAndUpdate(unit._id,
            {
                langley: parseFloat(unit.langley) - parseFloat(req.body.unit.langley)
            }
        );
    const currentUser = await User.findById(req.user._id);
    const log = new Log({message: `-${req.body.unit.langley} (${unit.name}) units outgoing to customer`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    await updatedUnit.save();
    req.flash('success', 'Outgoing Cabinets Documented');
    res.redirect('/outgoing/units');
}));

module.exports = router;