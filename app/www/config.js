'use strict'

// userConfig won't be created automatically
var userConfig;
try { userConfig = require('../userConfig'); }
catch (error) { userConfig = {}; }

module.exports = {
  dbString: userConfig.dbString || process.env.dbString || 'mongodb://localhost/klarify-scheduler',
  sessionSecret: userConfig.sessionSecret || process.env.sessionSecret || 'sssshhhared_secret'
};