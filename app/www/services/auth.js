'use strict';

var _ = require('lodash');
var chalk = require('chalk');
var compose = require('composable-middleware');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var Config = require('config');

var validateJwt = expressJwt({ secret: Config.appSecret });

/**
 * Middleware
 */
exports.isAuthenticated = function (req, res, next) {
  return compose().use(function (req, res, next) {
    // Allow access_token to be passed through query parameters as well
    if (req.query && req.query.hasOwnProperty('acces_token')) {
      req.headers.Authorization = 'Bearer ' + req.query.access_token
    }

    return validateJwt(req, res, next);
  }).use(function (req, res, next) {
    // Find user matching req.user._id and attach it to req.user, then call next()
    // If no user is found, return res.status(401).send('Unauthorized');

    next();
  });
};


/**
 * Decodes the token.
 *
 * @param {Object} req - express req object
 * @return {String} token
 */
exports.decodeToken = function (req) {
  var token = (req && req.headers) ? req.headers.authorization : req;
  return jwt.decode(token, Config.secrets.session);
}

/**
 * Returns a jwt token signed by the app secret
 *
 * @param {Object} options
 * @return {Object} jwt token
 */
exports.signToken = function (options) {
  return jwt.sign(options, Config.secrets.session, { expiresIn: 60 * 60 * 24 * 365 });
};

/**
 * @param {Object} req - express req object
 * @param {Object} res - express res object
 */
exports.setTokenCookie = function (req, res) {
  if (!req.user) {
    return res.status(404).json({message: 'Something went wrong, please try again.'});
  }

  var token = this.signToken({ _id: req.user._id });

  res.cookie('token', token);
}
