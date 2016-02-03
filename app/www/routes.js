'use strict';

var express = require('express');
var morgan = require('morgan');
var path = require('path');

var root = path.resolve();

/**
 * @param {Object} app - express app object
 * @param {Object} logger - logger from utils.logger
 */
module.exports = function (app, logger) {
    // Front end app
    app.use(express.static(root + '/build'));

    // Logging for API routes
    app.use(morgan('combined', { stream: logger.stream }));

    // Backend routes/modules below
    app.use('/api/session', require('./controllers/session'));

    app.use('/api/accounts', require('./controllers/accounts'));

    app.use('/api/endpoints', require('./controllers/endpoints'));

    app.use('/api/presets', require('./controllers/presets'));
};
