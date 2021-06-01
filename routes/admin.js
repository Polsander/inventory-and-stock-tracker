const express = require('express');
const router = express.Router();
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

//controller
const admin = require('../controllers/admin');

//middleware for validation and form submissions
const {validateSuperAdmin} = require('../middleware');

//Joi schema middleware
const {editUserSchema} = require('../schemas');

const verifyEdit = (req, res, next) => {
    const {error} = editUserSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw (new ExpressError(msg, 400))
    }
    else {
        next();
    }
};


router.get('/dashboard', validateSuperAdmin, catchAsync(admin.getDashboard));

router.delete('/dashboard/:id', validateSuperAdmin, catchAsync(admin.deleteUser));

router.get('/dashboard/edit/:id', validateSuperAdmin, catchAsync(admin.getUserEditPage));

router.put('/dashboard/edit/:id', validateSuperAdmin, verifyEdit, catchAsync(admin.editUser));

module.exports = router;