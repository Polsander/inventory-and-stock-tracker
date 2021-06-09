
module.exports.renderLogin = (req,res) => {
    if(req.user && req.user.isValidated){
        return res.redirect('/mainTracker');
    }
    else if (req.user && req.user.isAdmin) {
        return res.redirect('/landingPage')
    }
    else if (req.user && req.user.isSuperAdmin) {
        return res.redirect('/landingPage')
    }
    return res.render('users/login');
};

module.exports.loginUser = async(req,res) => {
    const redirectUrl = req.session.returnTo || '/';
    req.flash('success','Successfully Logged In');
    res.redirect(redirectUrl);
};