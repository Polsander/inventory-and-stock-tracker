const express = require('express');
const router = express.Router();

// errors, model schemas, and joi schemas here
const Cabinet = require('../models/cabinets');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// middleware
const {cabinetSchema, unitSchema} = require('../schemas.js');
const {isLoggedIn, validateUser, validateAdmin, validateSuperAdmin} = require('../middleware');

const validateCabinet = (req, res, next) => {
    const {error} = cabinetSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};

//---- Actual Routes Down Below
// For these routes, it has been shortened by 'cabinet' as reflected
// on the main app.js file.


router.get('/', isLoggedIn, validateUser, catchAsync(async(req, res) => {
    const cabinets = await Cabinet.find({})
    res.render('cabinets/index', {cabinets})
 }));

router.get('/new', validateSuperAdmin, (req,res) => {
    res.render('cabinets/new');
})

router.post('/', validateCabinet, validateSuperAdmin, catchAsync(async(req,res) => {
    const cabinet = new Cabinet(req.body.cabinet);
    await cabinet.save();
    req.flash('success', 'Successfully created a Cabinet');
    res.redirect('/cabinets');
}));
 

router.get('/:id', validateUser, catchAsync(async(req,res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/show', {cabinet})
}));

router.get('/:id/edit', validateSuperAdmin, catchAsync(async(req,res) => {
    const cabinet = await Cabinet.findById(req.params.id)
    res.render('cabinets/edit', {cabinet})
}));

router.put('/:id', validateCabinet, validateSuperAdmin, catchAsync(async(req,res) => {
   const cabinet = await Cabinet.findByIdAndUpdate(req.params.id, {...req.body.cabinet});
   req.flash('success', 'Successfully updated Cabinet')
   res.redirect(`/cabinets/${cabinet._id}`)
}));

router.delete('/:id', validateSuperAdmin, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Cabinet.findByIdAndDelete(id);
    req.flash('warning', 'Cabinet, and All Corresponding Units Deleted')
    res.redirect('/cabinets');
}));

module.exports = router;