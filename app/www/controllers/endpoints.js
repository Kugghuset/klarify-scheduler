'use strict';
var Methods = require('../models/method');
var vm = require('vm');

module.exports = function (req, res) {
    var path = req.path;
    var method = req.method;

    Methods
        .findOne({url: path, type: method}, function (err, resource) {
            if (err) {
                return res.status(500).send(err);
            }

            if(!resource) {
                return res.status(404).json({message: "Method not found"});
            }

            var sandbox = { fn: undefined };
            vm.createContext(sandbox);
            vm.runInContext('fn = ' + resource.code, sandbox);

            if (sandbox.fn && typeof sandbox.fn === 'function') {
                sandbox.fn(req, res);
            } else {
                res.status(501, "Endpoint is not a function");
            }
        });
};
