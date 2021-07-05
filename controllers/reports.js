const Log = require('../models/logs');
const User = require('../models/user');
const Cabinet = require('../models/cabinets');
const Unit = require('../models/units');
const Stock = require('../models/stock');
const { date } = require('joi');

module.exports.renderReports = async (req, res) => {
    const logs = await Log.find({}).populate({ path: 'users' })
    res.render('reports/index', { logs })
};

module.exports.deleteReport = async (req, res) => {
    await User.findByIdAndUpdate(req.params.userId, { $pull: { logs: req.params.logId } });
    await Log.findByIdAndDelete(req.params.logId);
    res.redirect('/reports')
};

module.exports.renderStock = async (req, res) => {
    const cabinetStocks = await Stock.find({cabinet: {$size: 1}}).populate({ path: 'cabinet' });
    
    const unitStocks = await Stock.find({unit: {$size: 1}}).populate({path: 'unit'});
    res.render('reports/stock', { cabinetStocks, unitStocks })
}