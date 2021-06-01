const jwt = require('jsonwebtoken');
const ExpressError = require('../utilities/ExpressError');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');

sgMail.setApiKey(process.env.Email_API_KEY);


module.exports.getResetForm = (req, res) => {
    res.render('users/forgot');
};

module.exports.forgotPasswordSubmission = async(req, res) => {
    const {email} = req.body;
    //Make sure User Exists
    const [user] = await User.find({email: email});
    if (!user) {
        req.flash('error', 'No User Belonging to that Email');
        return res.redirect('/forgot');
    };
    const secret = process.env.JWT_SECRET;
    const payload = {
        email: user.email,
        id: user._id,
        username: user.username
    };
    const token = jwt.sign(payload, secret, {expiresIn: '20m'});
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`
    // Here is code where the user is sent an email of this link
    const message = {
        to: user.email,
        from: 'gorillaman2234@gmail.com',
        subject: 'AZCO Inventory Tracker - Reset Password',
        text: `A password reset has been requested for your account,
        please follow this link to reset your password: ${link}`,
        html:"<h3> A password reset has been requested for your account</h3>" +
         "<p> Follow this link to reset your password: </p>" +
        `<a href="${link}">${link}</a>` +
        "<p>If you did not make a reset password request, you can safely ignore this email." +
        "The link token will expire in 20 minutes from when the request was made. </p>",
    }
    await sgMail.send(message).then(console.log('email sent'));
    console.log(link);
    // Redirecting the user to the forgot form
    req.flash('success', 'An email has been sent with further instructions');
    res.redirect('/forgot');

};

module.exports.renderResetPassword = async(req, res, next) => {
    const{id,token} = req.params;
    //check if id exists in database
    const user = await User.findById(id);
    if (!user) {
        req.flash('error','User does not exist');
        res.redirect('/forgot')
    };
    //Now must validate the JWT Token
    const secret = process.env.JWT_SECRET;
    try {
        const payload = jwt.verify(token, secret)
        return res.render('users/reset-password', {user, token});
        
    } catch (error) {
        throw new ExpressError(error.message, 403);
    }
};

module.exports.resetUserPassword = async(req,res,next) => {
    const {id, token} = req.params;
    const {password, password2} = req.body;
    // validate user
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'User does not exist');
        return res.redirect ('/forgot');
    }
    // validate token
    const secret = process.env.JWT_SECRET;
    try {
        const payload = jwt.verify(token, secret)

        //Password changes here
        await user.setPassword(password)
        await user.save();
        req.flash('success','Password Successfully Changed');
        return res.redirect('/');
        
    } catch (error) {
        throw new ExpressError(error.message, 403);
    };

};