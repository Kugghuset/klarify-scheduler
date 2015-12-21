'use strict';

var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var jwt = require('jsonwebtoken');
var CryptHelper = require('../helpers/crypt');
var Config = require('config');
var User = require('../models/user');

router.get('/', require('../auth/auth-middleware'), function(req, res) {
    res.json(req.user);
});

router.post('/sign-in', validate(require('./validations/sign-in')),  function(req, res) {
    var payload = req.body;
    User
        .findOne({email: payload.email}, function(err, user) {
            if (err) {
                console.log('error:', err);
                return res.status(500).json(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Incorrect username/password.' });
            }

            CryptHelper
                .compareHash(payload.password, user.password)
                .then(function (match) {
                    if(!match) {
                        return res.status(401).json({ message: 'Incorrect username/password.' });
                    }

                    jwt.sign({id: user._id}, Config.appSecret, {}, function (token) {
                        res.json(token);
                    });
                })
        });
});

module.exports = router;
