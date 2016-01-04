'use strict';

var Joi = require('joi');

exports.resources = {
    body: {
        name: Joi.string().required(),
        path: Joi.string().required(),
        absolutePath: Joi.string().required(),
        parentId: Joi.string().required(),
        userId: Joi.string().required(),
        level: Joi.number().required(),
        description: Joi.string()
    }
};

exports.methods = {
    body: {
        name            : Joi.string().required(),
        type            : Joi.string().allow(['GET', 'POST', 'DELETE']).required(),
        absoluteUrl     : Joi.string().required(),
        code            : Joi.string().required(),
        parentId        : Joi.string().required(),
        userId          : Joi.string().required(),
        description     : Joi.string(),
        disabled        : Joi.boolean().required()
    },

    query: {
        parentId    : Joi.string().required(),
        type        : Joi.string().allow(['GET', 'POST', 'DELETE']).required()
    }
};
