const express = require('express');
const router = express.Router();

const home = require('../controllers/home');

router.get('/', home.homePage);

module.exports = router;