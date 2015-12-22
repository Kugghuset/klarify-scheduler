'use strict';

var Joi = require('joi');

module.exports = {
    body: {
        email       : Joi.string().email().required().label('Email'),
        password    : Joi.string().required().label('Password')
    }
};
