'use strict';

var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var _ = require('lodash');
var EndpointRepo = require('../models/endpoint');


router.get('/', require('../auth/auth-middleware'), validate(require('./validations/endpoints').get), function (req, res) {
    var payload = req.query;

    EndpointRepo
        .find({}, {}, {skip: payload.skip, limit: payload.limit}, function (err, data) {
            if(err) {
                return res.status(400).send(err);
            }
            res.send(data);
        });

});


router.post('/', require('../auth/auth-middleware'), validate(require('./validations/endpoints').post), function (req, res) {
    var payload = req.body;

    var uniqueRoutes = _.uniq(payload.routes, function (route) {
        return route.subDirectory;
    });

    if(uniqueRoutes.length !== payload.routes.length) {
        return res.status(400).send('Duplicate routes are not allowed');
    }

    EndpointRepo
        .findOne({name: payload.name}, function (err, exists) {
            if (err) {
                return res.status(500).send(err);
            }

            if(exists) {
                return res.status(400).send("Endpoint with name " + '"' + payload.name + '"' + " already exists.");
            }

            EndpointRepo
                .create(payload, function (err, data) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.json(data);
                })
        })

});

router.put('/', require('../auth/auth-middleware'), validate(require('./validations/endpoints').post), function (req, res) {
    var payload = req.body;

    var uniqueRoutes = _.uniq(payload.routes, function (route) {
        return route.subDirectory;
    });

    if(uniqueRoutes.length !== payload.routes.length) {
        return res.status(400).send('Duplicate routes are not allowed');
    }

    EndpointRepo
        .update({_id: payload._id}, payload, function (err, data) {
            if(err) {
                return res.status(500).send(err);
            }

            res.json({success: true});
        })
});

router.delete('/', require('../auth/auth-middleware'), function (req, res) {
    var payload = req.query;

    EndpointRepo
        .remove({_id: payload.id}, function(err) {
            if(err) {
                return res.status(500).send(err);
            }

            res.json({success: true});
        })
});

module.exports = router;
