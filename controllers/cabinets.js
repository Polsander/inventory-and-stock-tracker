// errors, model schemas, and joi schemas here
const Cabinet = require('../models/cabinets');
const ExpressError = require('../utilities/ExpressError');


module.exports.renderCabinetList = async(req, res) => {
    const cabinets = await Cabinet.find({})
    res.render('cabinets/index', {cabinets})
 };

module.exports.renderCreateNewCabinet = (req,res) => {
    res.render('cabinets/new');
};

module.exports.createCabinet = async(req,res) => {
    const cabinet = new Cabinet(
        {
            name: req.body.cabinet.name,
            langley: 0,
            nakusp: 0
        }
    );
    await cabinet.save();
    req.flash('success', 'Successfully created a Cabinet');
    res.redirect('/cabinets');
};

module.exports.showCabinet = async(req,res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/show', {cabinet})
};

module.exports.showEditPage = async(req,res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/edit', {cabinet})
};

module.exports.editCabinet = async(req,res) => {
    const cabinet = await Cabinet.findByIdAndUpdate(req.params.id, {...req.body.cabinet});
    req.flash('success', 'Successfully updated Cabinet')
    res.redirect(`/cabinets/${cabinet._id}`)
};

module.exports.deleteCabinet = async(req,res) => {
    const {id} = req.params;
    await Cabinet.findByIdAndDelete(id);
    req.flash('warning', 'Cabinet, and All Corresponding Units Deleted')
    res.redirect('/cabinets');
};

