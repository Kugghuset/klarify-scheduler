'use strict'

var _ = require('lodash');
var Promise = require('bluebird');

var Endpoint = require('./endpoint.model.js');
var utils = require('../../utils/general.utils.js');


/**
 * Returns all non-disabled endpoints
 * 
 * Route: GET 'api/endpoints/'
 */
exports.index = function (req, res) {
  Endpoint.find({ disabled: { $ne: true } })
  .exec(function (err, endpoints) {
    if (err) {
      utils.handleError(res, err);
    } else {
      res.status(200).json(endpoints);
    }
  });
}

/**
 * Creates a new endpoint document
 * of the contents of *req*.body.
 * 
 * Route : POST '/api/endpoints/'
 */
exports.create = function (req, res) {
  // Endpoint data should be the body of req
  Endpoint.create(req.body, function (err, endpoint) {
    if (err) {
      utils.handleError(res, err);
    } else {
      res.status(200).json(endpoint);
    }
  });
}

/**
 * Updats the endpoint document matching *:id*
 * with the contents of *req*.body
 * 
 * Route PUT: '/api/endpoints/:id'
 */
exports.update = function (req, res) {
  // req.params.id corresponds to endpoint._id
  // Endpoint data should be the body of req
  Endpoint.findById(req.params.id)
  .exec(function (err, endpoint) {
    if (err) {
      utils.handleError(res, err);
    } else {
      var updated = _.merge(endpoint, req.body);
      
      updated.save(function (err, _endpoint) {
        if (err) {
          utils.handleError(res, err);
        } else {
          res.status(200).json(_endpoint);
        }
      });
    }
  });
}

/**
 * Deletes the document matching *:id*.
 * 
 * Route DELETE: '/api/endpoints/:id'
 */
exports.destroy = function (req, res) {
  // req.params.id corresponds to endpoint._id
  Endpoint.findByIdAndRemove(req.params.id)
  .exec(function (err, endpoint) {
    if (err) {
      utils.handleError(res, err);
    } else {
      res.status(204).send('No Content');
    }
  })
}
