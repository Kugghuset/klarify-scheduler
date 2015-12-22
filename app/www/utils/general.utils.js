'use strict'

var _ = require('lodash');
var Promise = require('bluebird');
var chalk = require('chalk');

function handleError(res, err) {
  console.log(chalk.red(err));
  res.status(500).send('Internal Error');
};

module.export = {
  handleError: handleError
}