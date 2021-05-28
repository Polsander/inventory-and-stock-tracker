const express = require('express');
const router = express.Router();

router.get('/reports', (req,res) => {
    res.send ('<h1><strong>Coming soon :)</strong><h1>')
})


module.exports = router;