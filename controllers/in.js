const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const Log = require('../models/logs');
const User = require('../models/user');
const ExpressError = require('../utilities/ExpressError');

module.exports.selectScreen = (req,res) => {
    res.render('in/select')
};

module.exports.getCabinetPage = async(req,res) => {
    const cabinets = await Cabinet.find({})
    res.render('in/cabinets', {cabinets});
};

module.exports.sendInCabinets = async(req,res) => {
    const [cabinet] = await Cabinet.find({name: req.body.cabinet.name});
    await Cabinet.updateOne({name: req.body.cabinet.name}, {langley: parseFloat(cabinet.langley) + parseFloat(req.body.cabinet.langley)});
    const currentUser = await User.findById(req.user._id);
    const log = new Log({message: `+${req.body.cabinet.langley} (${cabinet.name}) cabinets in to Langley`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    req.flash('success', 'Cabinets in - Documented')
    res.redirect('/in/cabinets');
};

module.exports.getUnitPage = async(req,res) => {
    const units = await Unit.find({});
    res.render('in/units', {units});
};

module.exports.sendInUnits = async(req,res) => {
    const [unit] = await Unit.find({name: req.body.unit.name});
    const [cabinet] = await Cabinet.find({units: unit.id})

    if (cabinet.nakusp < req.body.unit.langley) {
        throw new ExpressError("Not enough in Nakusp's stock to be sending in that many units", 403);
    }

    await Unit.updateOne({name: req.body.unit.name}, {langley: parseFloat(unit.langley) + parseFloat(req.body.unit.langley)});
    await Cabinet.updateOne({name: cabinet.name}, {nakusp: parseFloat(cabinet.nakusp) - parseFloat(req.body.unit.langley) })
    const currentUser = await User.findById(req.user._id)
    const log = new Log({message: `+${req.body.unit.langley} (${unit.name}) units in to Langley`, date: Date()});
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    req.flash('success', ' Units in - Documented');
    res.redirect('/in/units');
};