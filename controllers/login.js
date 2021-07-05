
const Stock = require('../models/stock');

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
    //const redirectUrl = req.session.returnTo || '/';

    //update stock upon login
    const cabinetStocks = await Stock.find({cabinet:{$size: 1}}); //this will only select cabinet stocks (not unit)
    

    // for (let cabinetStock of cabinetStocks) {
    //     if (cabinetStock.date < new Date()) {
    //         console.log('update would occur here');
    //         await Stock.findByIdAndUpdate(cabinetStock._id, { date: cabinetStock.date.setMinutes(cabinetStock.date.getMinutes() + 5) });
    //     }
    // }
    //end updating stock
    req.flash('success','Successfully Logged In');
    res.redirect('/');
};