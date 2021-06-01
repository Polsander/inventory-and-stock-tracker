const User = require('../models/user');

module.exports.getDashboard = async(req,res) => {
    const users = await User.find({});
    res.render('users/admin', {users});
};

module.exports.deleteUser = async(req,res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('warning', 'User Deleted');
    res.redirect('/admin/dashboard');
};

module.exports.getUserEditPage = async(req,res) => {
    const user = await User.findById(req.params.id);
    res.render('users/edit', {user});
};

module.exports.editUser = async(req,res) => {
    const user = await User.findByIdAndUpdate(req.params.id, {...req.body});
    if (req.body.validateUser === "isSuperAdmin") {
        user.isSuperAdmin = true;
        user.isAdmin = true;
        user.isValidated = true;
    } else if (req.body.validateUser === "isAdmin") {
     user.isSuperAdmin = false;
     user.isAdmin = true;
     user.isValidated = true;
    } else if (req.body.validateUser === "isValidated") {
     user.isSuperAdmin = false;
     user.isAdmin = false;
     user.isValidated = true;
    } else {
     user.isSuperAdmin = false;
     user.isAdmin = false;
     user.isValidated = false;
    }
 
    await user.save()
    res.redirect('/admin/dashboard')
 };