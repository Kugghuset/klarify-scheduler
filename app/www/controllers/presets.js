var express = require('express');
var router = express.Router();
var validate = require('express-validation');
var _ = require('lodash');
var PresetsRepo = require('../models/presets');

router.get('/', require('../auth/auth-middleware'), validate(require('./validations/presets').get), function (req, res) {
    var payload = req.query;

    PresetsRepo
        .find({}, {}, {skip: payload.skip, limit: payload.limit}, function (err, data) {
            if(err) {
                return res.status(400).send(err);
            }
            res.send(data);
        });

});

router.post('/', require('../auth/auth-middleware'), validate(require('./validations/presets').post), function (req, res) {
    var payload = req.body;

    PresetsRepo
        .findOne({value: payload.value}, function (err, exists) {
            if(err) {
                return res.status(500).send(err);
            }

            if(exists) {
                return res.status(400).send("Preset already exists.")
            }

            PresetsRepo
                .create(payload, function (err, preset) {
                    if(err) {
                        return res.status(500).send(err);
                    }

                    res.json(preset);
                })

        })
});

router.put('/', require('../auth/auth-middleware'), validate(require('./validations/presets').post), function (req, res) {
    var payload = req.body;

    PresetsRepo
        .update({_id: payload._id}, payload, function (err, preset) {
            if(err) {
                return res.status(500).send(err);
            }
            res.json(preset);
        });
});

router.delete('/', require('../auth/auth-middleware'), validate(require('./validations/presets').delete), function (req, res) {
    var payload = req.query;

    PresetsRepo
        .remove({_id: payload.id}, function (err, preset) {
            if(err) {
                return res.status(500).send(err);
            }
            res.json({success: true});
        });
});

module.exports = router;
