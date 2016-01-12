'use strict';

var Later = require('later');
var EndpointsRepo = require('../models/endpoint');
var _ = require('lodash');
var Http = require('superagent');
var LogsRepo = require('../models/logs');

var internals = {
    crons: {},

    getEndpoints: function (cb) {
        EndpointsRepo
            .find({}, function (err, data) {
                if(err) {
                    cb(err);
                }
                cb(null, data);
            });
    },

    createCron: function (endpointId, job) {
        if(!internals.crons[endpointId]) {
            internals.crons[endpointId] = [];
        }

        internals.crons[endpointId].push(Later.setInterval(function () {
            var payload = {
                completeUrl: job.path,
                endpointId: endpointId,
                requestType: 'scheduled'
            };

            LogsRepo
                .create(payload, function (err) {
                    if (err) {
                        console.log('Error in creating scheduled log', err);
                    }
                });
            Http
                .get(job.path)
                .end(function (err) {
                    if(err) {
                        console.log('Error in requesting url', err);
                    }
                });
        }, job.scheduledAt));
    }
};

exports.runAllCrons = function () {

    console.log('*******************Executing crons**********************');
    internals
        .getEndpoints(function(err, endpoints) {
            if(err) {
                return console.log('Error', err);
            }

            endpoints.forEach(function (endpoint) {
                if(endpoint && endpoint.routes) {
                    endpoint
                        .routes
                        .forEach(function (route, idx) {
                            if(route.schedule) {
                                internals
                                    .createCron(endpoint._id, {
                                        path: endpoint.baseUrl + (endpoint.subDirectory?'/'+endpoint.subdirectory:'')  + (route.subDirectory?'/'+route.subDirectory:''),
                                        scheduledAt: Later.parse.text(route.schedule)
                                    });
                            }
                        })
                }
            });
        });
};

exports.stopCron = function (endpointId, cb) {

    console.log('*******************Stopping crons**********************');
    internals
        .crons[endpointId]
        .forEach(function (cron) {
            cron.clear();
        });

    delete internals.crons[endpointId];

    if(cb && typeof cb === 'function'){
        cb(true);
    }
};

exports.rescheduleCron = function (endpoint) {

    console.log('*******************Re-scheduling crons**********************');
    this
        .stopCron(endpoint._id, function () {
            if(endpoint && endpoint.routes) {
                endpoint
                    .routes
                    .forEach(function (route) {
                        if(route.schedule) {
                            internals
                                .createCron(endpoint._id, {
                                    path: endpoint.baseUrl + (endpoint.subDirectory?'/'+endpoint.subdirectory:'')  + (route.subDirectory?'/'+route.subDirectory:''),
                                    scheduledAt: Later.parse.text(route.schedule)
                                });
                        }
                    });
            }
        });
};
