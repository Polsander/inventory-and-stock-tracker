module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You Must Sign In');
        return res.redirect('/login');
    }
    next();
};

module.exports.validateUser = (req,res,next) => {
    if(!req.user.isValidated) {
        req.flash('error', 'You Must Be A User');
        return res.redirect('/');
    }
    next();
};

module.exports.validateAdmin = (req,res,next) => {
    if(!req.user.isAdmin) {
        req.flash('error', 'You Are Not Admin');
        return (res.redirect('/'));
    };
    next();
};

module.exports.validateSuperAdmin = (req,res,next) => {
    if(!req.user.isSuperAdmin) {
        req.flash('error', 'You Do Not Have Permission To Do This');
        return res.redirect('/');
    };
    next();
};