'use strict';

var PresetsRepo = require('../models/presets');
var DefaultPresets = require('./presets.json');

module.exports = function () {

    DefaultPresets
        .map(function (preset) {
            PresetsRepo
                .findOne({value: preset.value}, function (err, exists) {
                    if(err) {
                        return console.log('Error in fetching presets', err);
                    }

                    if(!exists) {
                        PresetsRepo
                            .create(preset, function (err) {
                                if(err) {
                                    return console.log('Error in inserting preset', err);
                                }

                                console.log('Added default preset: ' + preset.name);
                            })
                    }
                })
        });
};
