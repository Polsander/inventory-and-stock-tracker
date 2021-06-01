const User = require('../models/user');

module.exports.getRegisterPage = (req, res) => {
    res.render('users/register')
};

module.exports.registerNewUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.logout();
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'User Successfully Registered')
            res.redirect('/');
        });

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

};