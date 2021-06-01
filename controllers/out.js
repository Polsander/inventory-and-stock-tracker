const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const User = require('../models/user');
const Log = require('../models/logs');
const ExpressError = require('../utilities/ExpressError');

module.exports.selectScreen = (req, res) => {
    res.render('out/select')
};

module.exports.getCabinetPage = async (req, res) => {
    const cabinets = await Cabinet.find({});
    res.render('out/cabinets', { cabinets });
};

module.exports.sendCabinetOut = async (req, res) => {
    const [cabinet] = await Cabinet.find({ name: req.body.cabinet.name });
    if (req.body.cabinet.langley > cabinet.langley) {
        throw new ExpressError('Sending out too large of a quantity (more than what is in stock)', 403);
    }
    const updatedCab =
        await Cabinet.findByIdAndUpdate(cabinet._id,
            {
                langley: (parseFloat(cabinet.langley) - parseFloat(req.body.cabinet.langley)),
                nakusp: (parseFloat(cabinet.nakusp) + parseFloat(req.body.cabinet.langley))
            }
        );
    const currentUser = await User.findById(req.user._id);
    const log = new Log({message: `-${req.body.cabinet.langley} (${cabinet.name}) cabinets out to Nakusp`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    await updatedCab.save();
    req.flash('success', 'Cabinets Out - Documented')
    res.redirect('/out/cabinets')
};

module.exports.getUnitPage = async (req, res) => {
    const units = await Unit.find({});
    res.render('out/units', { units });
};

module.exports.sendUnitOut = async (req, res) => {
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
    const log = new Log({message: `-${req.body.unit.langley} (${unit.name}) units out to customer`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    await updatedUnit.save();
    req.flash('success', 'Units Out - Documented');
    res.redirect('/out/units');
};