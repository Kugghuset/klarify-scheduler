'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var Config = require('config');
var logger = require('./utils/logger.util.js');
var DB = require('./db');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./routes')(app, logger);

app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(function (err, req, res, next) {
    if (err.message === 'validation error') {
        res.status(err.status).json(err);
    } else {
        next(err);
    }
});

// Passport setup
require('./auth/passport-setup')(app);
require('./crons').runAllCrons();

var server = app.listen(Config.web.port, function () {
    console.log('App listening on port %s', Config.web.port);
    process.send('online');
});

var stop = function () {
    server.close(function () {
        console.log( "Server stopped");
        DB.mongoose.disconnect(function () {
            console.log('Connection with database closed.')
        });
    });
};

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
