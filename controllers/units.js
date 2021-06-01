const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');

module.exports.renderUnitsList = async(req,res) => {
    const cabinets = await Cabinet.find({}).populate('units')
    res.render('units/index', {cabinets});
};

module.exports.renderNewUnitPage = async(req,res) => {
    const cabinets = await Cabinet.find({})
    res.render('units/new', {cabinets})
};

module.exports.createNewUnit = async(req,res) => {
    const findCabinet = await Cabinet.find({name: req.body.cabinet.name})
    const unit = new Unit({name: req.body.unit.name, langley: 0});
    const cabinet = findCabinet[0]
    cabinet.units.push(unit);
    await unit.save();
    await cabinet.save();
    req.flash('success', 'Successfully Added A Unit')
    res.redirect('/units');
};

module.exports.renderUnitShow = async(req,res) => {
    const findCabinet = await Cabinet.find({units: req.params.id})
    const cabinet = findCabinet[0]
    const unit = await Unit.findById(req.params.id)
    res.render('units/show',{cabinet, unit})
};

module.exports.renderUnitEdit = async(req,res) => {
    const unit = await Unit.findById(req.params.id)
    const cabinets = await Cabinet.find({})
    const cabinet = await Cabinet.find({units: req.params.id})
    const originalCabinet = cabinet[0]
    res.render('units/edit', {unit, cabinets, originalCabinet})
};

module.exports.editUnit = async(req,res) => {
    const unit = await Unit.findByIdAndUpdate(req.params.id, {...req.body.unit});
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: {units: req.params.id}});
    const findCabinet = await Cabinet.find({name: req.body.cabinet.name});
    const cabinet = findCabinet[0];
    cabinet.units.push(unit);
    await unit.save();
    await cabinet.save();
    req.flash('success', 'Successfully updated Unit')
    res.redirect(`/units/${unit._id}`);
};

module.exports.deleteUnit = async(req,res) => {
    await Cabinet.findByIdAndUpdate(req.params.cabinetId, { $pull: {units: req.params.id}});
    await Unit.findByIdAndDelete(req.params.id);
    req.flash('warning', 'Unit Deleted')
    res.redirect('/units');
};