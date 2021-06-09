const express = require('express');
const router = express.Router();

const mainTracker = require('../controllers/mainTracker');

router.get('/mainTracker', mainTracker.mainTracker);

module.exports = router;