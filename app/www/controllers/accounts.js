'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CryptHelper = require('../helpers/crypt');
var validate = require('express-validation');
var Roles = require('../helpers/roles');


router.post('/register', validate(require('./validations/register')), function(req, res) {
    var payload = req.body;

    if(payload && payload.email) {
        User
            .findOne({email: payload.email}, function (err, exists) {
                if(err) {
                    return res.status(400).send(err);
                }

                if(exists) {
                    return res.status(400).send('User with this email address already exists.');
                }

                CryptHelper
                    .genHash(payload.password)
                    .then(function(hash) {

                        payload.password = hash;
                        payload.role = Roles.USER;
                        delete payload.confirmPassword;

                        User
                            .register(payload, function (err, user) {
                                if(err) {
                                    return res.status(400).send(err);
                                }

                                User.clean(user, function(data) {
                                    res.send(data);
                                });
                            })

                    })
            })
    }
});

module.exports = router;
