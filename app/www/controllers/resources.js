'use strict';

var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var Resources = require('../models/resource');
var Methods = require('../models/method');
var Async = require('async');


router.get('/', require('../auth/auth-middleware'), function (req, res) {

    Resources
        .find({}, function (err, data) {
            if(err) {
                return res.status(400).send(err);
            }

            return res.json(data);
        });
});

router.post('/', require('../auth/auth-middleware'), validate(require('./validations/resources').resources.body), function (req, res) {
    var payload = req.body;

    Resources
        .find({absolutePath: payload.absolutePath}, function (err, exists) {
            if(err) {
                return res.status(400).send(err);
            }

            if(exists && exists.length) {
                return res.status(400).send('Resource path already exists');
            }

            Resources
                .create(payload, function (err, data) {
                    if(err) {
                        return res.status(400).send(err);
                    }

                    res.json(data);
                });
        });
});

router.delete('/', require('../auth/auth-middleware'), function (req, res) {
    var payload = req.query;

    Resources
        .remove({absolutePath: {$regex: payload.path}}, function (err) {
            if(err) {
                return res.status(400).send(err);
            }

            Methods
                .remove({url: {$regex: payload.path}}, function (err) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.json({success: true});
                });
        });
});

router.get('/count', require('../auth/auth-middleware'), function (req, res) {

    Async
        .parallel({
            resources: function (cb) {
                Resources.count({}, cb);
            },
            methods: function (cb) {
                Methods.count({}, cb);
            }
        }, function (err, results) {
            if(err) {
                console.log('error: ' + err);
                return res.status(500).send(err);
            }

            res.send(results);
        });
});

router.get('/methods', require('../auth/auth-middleware'), validate(require('./validations/resources').methods.query), function (req, res) {
    var payload = req.query;

    Methods
        .findOne({parentId: payload.parentId, type: payload.type}, function (err, data) {
            if(err) {
                return res.status(400).send(err);
            }

            Methods
                .clean(data, function (method) {
                    res.json(method);
                })
        });
});

router.post('/methods', require('../auth/auth-middleware'), validate(require('./validations/resources').methods.body),  function (req, res) {
    var payload = req.body;

    Methods
        .find({parentId: payload.parentId, type: payload.type}, function (err, exists) {
            if(err) {
                return res.status(400).send(err);
            }

            if(exists && exists.length) {
                return res.status(400).send('Method already exists');
            }

            Methods
                .create(payload, function (err, data) {
                    if(err) {
                        return res.status(400).send(err);
                    }
                    Resources
                        .update({_id: payload.parentId}, {$push: {methods: payload.type}}, function (err) {
                            if(err) {
                                return res.status(400).send(err);
                            }
                            res.json(data);
                        });
                });
        });
});

router.put('/methods', require('../auth/auth-middleware'), function (req, res) {
    var payload = req.body;

    Methods
        .update({_id: payload._id}, payload, function (err) {
            if(err) {
                return res.status(400).send(err);
            }

            res.json({success: true});

        });
});

router.delete('/methods', require('../auth/auth-middleware'), function (req, res) {
    var payload = req.query;

    Methods
        .remove({$and: [{parentId: payload.parentId}, {type: payload.type}]}, function (err) {
            if(err) {
                return res.status(400).send(err);
            }

            Resources
                .update({_id: payload.parentId}, {$pull: {methods: payload.type}}, function (err) {
                    if(err) {
                        return res.status(400).send(err);
                    }
                    res.json({success: true});
                });
        });
});

module.exports = router;
