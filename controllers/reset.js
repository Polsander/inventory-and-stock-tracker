const jwt = require('jsonwebtoken');
const ExpressError = require('../utilities/ExpressError');
const SibApiV3Sdk = require('sib-api-v3-sdk');
const User = require('../models/user');


//email reset set-up config below
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SIB_API_KEY;


module.exports.getResetForm = (req, res) => {
    res.render('users/forgot');
};

module.exports.forgotPasswordSubmissionSIB = async (req, res) => {
    const { username } = req.body;
    const [user] = await User.find({ username: username });
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

    const link = `https://azco-stock-tracker.onrender.com/reset-password/${user._id}/${token}`;
    // set email API
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
        sender: {
            name: 'AZCO-DoNotReply',
            email: 'azcozonereset@gmail.com'
        },
        to: [{
            email: user.email,
            name: user.username
        }],
        subject: 'Reset Password Request - AZCO Industries',
        params: {
            message: `Hello ${user.username}, a password reset has been requested for your account. Please follow the link to reset your password.`,
            resetLink: link,
            warningNotice: 'If you did not request a password reset, you can safely ignore this email. This link will expire in 20 minutes'
        },
        templateId: 1,

    };

    try {
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API Called successfully');
        req.flash('success', 'An email has been sent with further instructions');
        res.redirect('/forgot');

    } catch(e) {
        throw new ExpressError(e, 403);
    }

}

module.exports.forgotPasswordSubmissionAdmin = async (req, res, next) => {
    const username = req.params.username;
    //Make sure User Exists
    const [user] = await User.find({ username: username });
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
    const token = jwt.sign(payload, secret, { expiresIn: '20m' });
    // Redirecting the user to the forgot form
    res.redirect(`/reset-password/${user._id}/${token}`);
}

module.exports.renderResetPassword = async (req, res, next) => {
    const { id, token } = req.params;
    //check if id exists in database
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'User does not exist');
        res.redirect('/forgot')
    };
    //Now must validate the JWT Token
    const secret = process.env.JWT_SECRET;
    try {
        const payload = jwt.verify(token, secret)
        return res.render('users/reset-password', { user, token });

    } catch (error) {
        throw new ExpressError(error.message, 403);
    }
};

module.exports.resetUserPassword = async (req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    // validate user
    const user = await User.findById(id);
    if (!user) {
        req.flash('error', 'User does not exist');
        return res.redirect('/forgot');
    }
    // validate token
    const secret = process.env.JWT_SECRET;
    try {
        const payload = jwt.verify(token, secret)

        //Password changes here
        await user.setPassword(password)
        await user.save();
        req.flash('success', 'Password Successfully Changed');
        return res.redirect('/');

    } catch (error) {
        throw new ExpressError(error.message, 403);
    };

};