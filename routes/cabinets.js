const express = require('express');
const router = express.Router();

// controller
const cabinet = require('../controllers/cabinets');

// errors, model schemas, and joi schemas here
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

// middleware
const {cabinetSchema, cabinetEditSchema} = require('../schemas.js');
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

const validateCabinetEdit = (req, res, next) => {
    const {error} = cabinetEditSchema.validate(req.body);
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


router.get('/', isLoggedIn, validateAdmin, catchAsync(cabinet.renderCabinetList));

router.get('/new', validateSuperAdmin, cabinet.renderCreateNewCabinet);

router.post('/', validateCabinet, validateSuperAdmin, catchAsync(cabinet.createCabinet));
 
router.get('/:id', validateAdmin, catchAsync(cabinet.showCabinet));

router.get('/:id/edit', validateSuperAdmin, catchAsync(cabinet.showEditPage));

router.put('/:id', validateCabinetEdit, validateSuperAdmin, catchAsync(cabinet.editCabinet));

router.delete('/:id', validateSuperAdmin, catchAsync(cabinet.deleteCabinet));

module.exports = router;