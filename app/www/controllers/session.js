'use strict';

var express = require('express');
var router = express.Router();

router.get('/', require('../auth/auth-middleware'), function(req, res) {
    res.send('got request at:' + res);
});

module.exports = router;
