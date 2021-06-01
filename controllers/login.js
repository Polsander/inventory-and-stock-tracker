
module.exports.renderLogin = (req,res) => {
    res.render('users/login');
};

module.exports.loginUser = async(req,res) => {
    const redirectUrl = req.session.returnTo || '/';
    req.flash('success','Successfully Logged In');
    res.redirect(redirectUrl);
};