'use strict'
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');
var logger = require('./utils/logger.util');

mongoose.connect(config.dbString);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app, logger);

var server = app.listen(3000, function() {
  var port = server.address().port;
  
  console.log('App listening on port %s', port);
});