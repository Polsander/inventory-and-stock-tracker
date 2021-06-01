const express = require('express');
const router = express.Router();
const units = require('../controllers/units');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

//middleware
const {unitSchemaEdit, unitSchema} = require('../schemas.js')
const {isLoggedIn, validateUser, validateAdmin, validateSuperAdmin} = require('../middleware');


const validateUnit = (req, res, next) => {
    const {error} = unitSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw( new ExpressError(msg, 400))
    }
    else {
        next();
    }
};

const validateUnitEdit = (req, res, next) => {
    const {error} = unitSchemaEdit.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw( new ExpressError(msg, 400))
    }
    else {
        next();
    }
};


//These are the routes for units below
router.get('/', isLoggedIn, validateAdmin, catchAsync(units.renderUnitsList));

router.get('/new', validateSuperAdmin, catchAsync(units.renderNewUnitPage));

router.post('/', validateUnit, validateSuperAdmin, catchAsync(units.createNewUnit));

router.get('/:id', validateAdmin, catchAsync(units.renderUnitShow));

//edit route

router.get('/:id/edit', validateSuperAdmin, catchAsync(units.renderUnitEdit));

router.put('/:id/edit/:cabinetId', validateUnitEdit, validateSuperAdmin, catchAsync(units.editUnit));

// delete route
router.delete('/:id/cabinets/:cabinetId', validateSuperAdmin, catchAsync(units.deleteUnit));

module.exports = router;