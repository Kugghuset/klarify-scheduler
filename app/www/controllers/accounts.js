'use strict';

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var CryptHelper = require('../helpers/crypt');
var validate = require('express-validation');
var Joi = require('joi');
var Roles = require('../helpers/roles');

var validation = {
    register: {
        body: {
            firstName           : Joi.string().required().label('First Name'),
            lastName            : Joi.string().required().label('Last Name'),
            email               : Joi.string().email().required().label('Email'),
            password            : Joi.string().min(6).required().label('Password'),
            confirmPassword     : Joi.any().valid(Joi.ref('password')).required().label('Password Confirmation'),
            createdAt           : Joi.date().default(new Date(), 'time of creation')
        }
    }
};


router.post('/register', validate(validation.register), function(req, res) {
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
