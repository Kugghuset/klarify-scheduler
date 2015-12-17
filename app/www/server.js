'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('config');
var logger = require('./utils/logger.util.js');


module.exports = function (cb) {
    var app = express();

    require('./routes')(app, logger);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    var server = app.listen(config.web.port, function () {
        console.log('App listening on port %s', config.web.port);
        process.send('online');
    });

    var stop = function () {
        server.close(function () {
            console.log( "Server stopped");
        });
    };

    process.on('SIGTERM', stop);
    process.on('SIGINT', stop);
};
