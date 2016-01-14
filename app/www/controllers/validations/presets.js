'use strict';

var Joi = require('joi');

module.exports = {
    get: {
        query: {
            skip: Joi.number().required(),
            limit: Joi.number().required()
        }
    },
    post : {
        body : {
            name: Joi.string().label('Name').required(),
            value: Joi.string().label('value').required(),
            userId: Joi.string().label('userId').required(),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date())
        }
    },

    delete : {
        query : {
            id: Joi.string().label('presetId').required()
        }
    }
};
