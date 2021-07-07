const Cabinet = require('../models/cabinets');
const User = require('../models/user');
const Log = require('../models/logs');
const Unit = require('../models/units');
const Stock = require('../models/stock');

module.exports.renderUnitsList = async (req, res) => {
    const cabinets = await Cabinet.find({}).populate('units')
    res.render('units/index', { cabinets });
};

module.exports.renderNewUnitPage = async (req, res) => {
    const cabinets = await Cabinet.find({})
    res.render('units/new', { cabinets })
};

module.exports.createNewUnit = async (req, res) => {
    const findCabinet = await Cabinet.find({ name: req.body.cabinet.name })
    const unit = new Unit({ name: req.body.unit.name, langley: 0, leadTime: req.body.unit.leadTime });
    const cabinet = findCabinet[0]
    cabinet.units.push(unit);
    //creating unit stock
    const stock = new Stock({
        date: new Date().setMonth( new Date().getMonth() + 1),
    });
    stock.unit.push(unit);
    //done
    await stock.save();
    await unit.save();
    await cabinet.save();
    

    //grabbing user and logging
    const currentUser = await User.findById(req.user._id)
    const log = new Log({ message: `Created Unit: ${unit.name}`, date: Date() });
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end

    req.flash('success', 'Successfully Added A Unit')
    res.redirect('/units');
};

module.exports.renderUnitShow = async (req, res) => {
    const findCabinet = await Cabinet.find({ units: req.params.id })
    const cabinet = findCabinet[0]
    const unit = await Unit.findById(req.params.id)
    res.render('units/show', { cabinet, unit })
};

module.exports.renderUnitEdit = async (req, res) => {
    const unit = await Unit.findById(req.params.id)
    const cabinets = await Cabinet.find({})
    const cabinet = await Cabinet.find({ units: req.params.id })
    const originalCabinet = cabinet[0]
    res.render('units/edit', { unit, cabinets, originalCabinet })
};

module.exports.editUnit = async (req, res) => {
    const unit = await Unit.findByIdAndUpdate(req.params.id, { ...req.body.unit });
    const originalCabinet = await Cabinet.findById(req.params.cabinetId);
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: { units: req.params.id } });
    const findCabinet = await Cabinet.find({ name: req.body.cabinet.name });
    const cabinet = findCabinet[0];
    cabinet.units.push(unit);

    //log user updating cabinet
    const { langley, name } = req.body.unit
    const currentUser = await User.findById(req.user._id)
    const log = new Log(
        {
            message: `Edited Unit: ${unit.name}`,
            changedName: `Changed Name: ${unit.name} → ${name}`,
            changedLangley: `Langley stock: ${unit.langley} → ${langley}`,
            changedCabinet: `Parent Cabinet: ${originalCabinet.name} → ${cabinet.name}`,
            date: Date()
        }
    );
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end

    await unit.save();
    await cabinet.save();
    req.flash('success', 'Successfully updated Unit')
    res.redirect(`/units/${unit._id}`);
};

module.exports.deleteUnit = async (req, res) => {
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: { units: req.params.id } });
    const unit = await Unit.findById(req.params.id);
    //removing stock
    await Stock.findOneAndDelete({unit: {_id: unit._id}})
    //done
    //log user action
    const currentUser = await User.findById(req.user._id)
    const log = new Log(
        {
            message: `Deleted Unit: ${unit.name}`,
            date: Date()
        }
    );
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end
    await Unit.findByIdAndDelete(req.params.id);
    req.flash('warning', 'Unit Deleted')
    res.redirect('/units');
};