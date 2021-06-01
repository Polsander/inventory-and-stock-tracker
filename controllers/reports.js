const Log = require('../models/logs');
const User = require('../models/user');

module.exports.renderReports = async(req,res) => {
    const logs = await Log.find({}).populate({path: 'users'})
    res.render ('reports/index', {logs})
};

module.exports.deleteReport = async(req,res) => {
    await User.findByIdAndUpdate(req.params.userId, { $pull: {logs: req.params.logId}});
    await Log.findByIdAndDelete(req.params.logId);
    res.redirect('/reports')
};