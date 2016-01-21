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
            baseUrl: Joi.string().uri().required().label('Base URL'),
            subDirectory: Joi.string().allow('').label('Sub Directory'),
            description: Joi.string().allow('').label('Description'),
            isDisabled: Joi.boolean().label('Disabled'),
            routes: Joi.array().items(Joi.object().keys({
                name: Joi.string(),
                subDirectory: Joi.string().required(),
                interval: Joi.number().default(15),
                schedule: Joi.string()
            })),
            createdAt: Joi.date().default(new Date()),
            updatedAt: Joi.date().default(new Date())
        }
    },

    request: {
        query: {
            endpointId: Joi.string().required().label('Endpoint Id'),
            routeIndex: Joi.number().required().label('Route Index')
        }
    }
};
