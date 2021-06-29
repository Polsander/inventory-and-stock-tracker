// errors, model schemas, and joi schemas here
const Cabinet = require('../models/cabinets');
const User = require('../models/user');
const Log = require('../models/logs');
const Stock = require('../models/stock');
const ExpressError = require('../utilities/ExpressError');
const { findById } = require('../models/logs');


module.exports.renderCabinetList = async (req, res) => {
    const cabinets = await Cabinet.find({})
    res.render('cabinets/index', { cabinets })
};

module.exports.renderCreateNewCabinet = (req, res) => {
    res.render('cabinets/new');
};

module.exports.createCabinet = async (req, res) => {
    const cabinet = new Cabinet(
        {
            name: req.body.cabinet.name,
            leeway: req.body.cabinet.leeway,
            langley: 0,
            nakusp: 0
        }
    );
    await cabinet.save();
    //creating a stock tracker for cabinet
    const stock = new Stock({
        outData: [],
        totalMonthData: [],
        date: new Date(),
    });
    stock.cabinet.push(cabinet);
    await stock.save();
    //grabbing user and logging
    const currentUser = await User.findById(req.user._id)
    const log = new Log({ message: `Created Cabinet: ${cabinet.name}`, date: Date() });
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end
    req.flash('success', 'Successfully created a Cabinet');
    res.redirect('/cabinets');
};

module.exports.showCabinet = async (req, res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/show', { cabinet })
};

module.exports.showEditPage = async (req, res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/edit', { cabinet })
};

module.exports.editCabinet = async (req, res) => {
    const cabinet = await Cabinet.findByIdAndUpdate(req.params.id, { ...req.body.cabinet });
    //log user updating cabinet
    const { nakusp, langley, name } = req.body.cabinet
    const currentUser = await User.findById(req.user._id)
    const log = new Log(
        {
            message: `Edited Cabinet: ${cabinet.name}`,
            changedName: `Changed Name: ${cabinet.name} → ${name}`,
            changedLangley: `Langley stock: ${cabinet.langley} → ${langley}`,
            changedNakusp: `Nakusp stock: ${cabinet.nakusp} → ${nakusp}`,
            date: Date()
        }
    );
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end
    req.flash('success', 'Successfully updated Cabinet')
    res.redirect(`/cabinets/${cabinet._id}`)
};

module.exports.deleteCabinet = async (req, res) => {
    const { id } = req.params;
    const cabinet = await Cabinet.findById(id);
    //log user action
    const currentUser = await User.findById(req.user._id)
    const log = new Log(
        {
            message: `Deleted Cabinet: ${cabinet.name}`,
            date: Date()
        }
    );
    log.users.push(currentUser);
    currentUser.logs.push(log);
    await log.save();
    await currentUser.save();
    //end
    await Cabinet.findByIdAndDelete(id);

    req.flash('warning', 'Cabinet, and All Corresponding Units Deleted')
    res.redirect('/cabinets');
};

