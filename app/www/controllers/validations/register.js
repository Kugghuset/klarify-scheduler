'use strict';

var Joi = require('joi');

module.exports = {
    body: {
        firstName           : Joi.string().required().label('First Name'),
        lastName            : Joi.string().required().label('Last Name'),
        email               : Joi.string().email().required().label('Email'),
        password            : Joi.string().min(6).required().label('Password'),
        confirmPassword     : Joi.any().valid(Joi.ref('password')).required().label('Password Confirmation'),
        createdAt           : Joi.date().default(new Date(), 'time of creation')
    }
};
