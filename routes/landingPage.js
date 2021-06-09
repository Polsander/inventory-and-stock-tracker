const express = require('express');
const router = express.Router();

const landingPage = require('../controllers/landingPage');

router.get('/landingPage', landingPage.landingPage);

module.exports = router;