'use strict';

angular
    .module('klarifyApp')
    .controller(
        'endpointsCtrl',
        [
            '$scope',
            '$http',
            'toaster',
            function ($scope, $http, toaster) {
                $scope.view = 'defaultView';
                $scope.endpoints = [];
                $scope.limit = 10;
                $scope.showLoadMoreBtn = false;
                $scope.presets = [];

                $scope.loadEndpoints = function () {
                    $http
                        .get('/api/endpoints', {params: {skip: $scope.endpoints.length, limit: $scope.limit}})
                        .then(function(success) {
                            $scope.endpoints = $scope.endpoints.concat(success.data);
                            $scope.showLoadMoreBtn = success.data.length === 10;
                        })
                        .catch(function (error) {
                            toaster
                                .pop({
                                    type: 'error',
                                    title: 'Error',
                                    body: error.data,
                                    showCloseButton: true
                                });
                        });

                };

                $http
                    .get('/api/presets', {params: {skip: $scope.presets.length, limit: $scope.limit}})
                    .then(function (success) {
                        $scope.presets = $scope.presets.concat(success.data);
                    })
                    .catch(function (error) {
                        toaster
                            .pop({
                                type: 'error',
                                title: 'Error',
                                body: error.data,
                                showCloseButton: true
                            });
                    });

                $scope.loadEndpoints();

                $scope.$watch("endpoint.subdirectory", function (newVal, oldVal) {
                    if (newVal && newVal !== oldVal) {
                        $scope.endpoint.subdirectory = newVal
                                                        .replace(/\/{2,}/g, '/')
                                                        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\]/gi, '-')
                                                        .replace(/\-{2,}/g, '-');
                    }
                });

                $scope.createEndpoint = function () {
                    $scope.endpoint = {
                        isDisabled: false,
                        routes: [{
                            interval: 15
                        }]
                    };
                    $scope.view = 'formView';
                };

                $scope.addRoute = function () {
                    $scope.endpoint.routes.push({interval: 15});
                };

                $scope.deleteRoute = function (index) {
                    $scope.endpoint.routes.splice(index, 1);
                };

                $scope.cancel = function () {
                    $scope.view = 'defaultView';
                    $scope.endpointFrm.$setPristine();
                };

                $scope.save = function () {
                    $http
                        .post('/api/endpoints', $scope.endpoint)
                        .then(function (success) {
                            toaster
                                .pop({
                                    type: 'success',
                                    title: 'Success',
                                    body: 'Endpoint saved successfully',
                                    showCloseButton: true
                                });
                            $scope.endpoints.push(success.data);
                            $scope.editEndpoint(success.data);
                        })
                        .catch(function (err) {
                            toaster
                               .pop({
                                   type: 'error',
                                   title: 'Error',
                                   body: err.data,
                                   showCloseButton: true
                               });
                        });
                };

                $scope.editEndpoint = function (endpoint) {
                    $scope.endpoint = endpoint;
                    $scope.view = 'editView';
                };

                $scope.update = function () {
                    $http
                        .put('/api/endpoints', $scope.endpoint)
                        .then(function (success) {
                            toaster
                                .pop({
                                    type: 'success',
                                    title: 'Success',
                                    body: 'Endpoint updated successfully',
                                    showCloseButton: true
                                });
                        })
                        .catch(function (err) {
                            toaster
                                .pop({
                                    type: 'error',
                                    title: 'Error',
                                    body: err.data,
                                    showCloseButton: true
                                });
                        });
                };

                $scope.deleteEndpoint = function (id) {
                    if(confirm('Do you really want to delete this endpoint?')) {
                        $http
                            .delete('/api/endpoints', {params: {id: id}})
                            .then(function () {

                                $scope.endpoints = _.chain($scope.endpoints)
                                                        .filter(function (endpoint) {
                                                            return endpoint._id !== id;
                                                        })
                                                        .value();
                                $scope.cancel();
                                toaster
                                    .pop({
                                        type: 'info',
                                        title: 'Info',
                                        body: 'Endpoint deleted successfully.',
                                        showCloseButton: true
                                    });
                            })
                            .catch(function (err) {
                                toaster
                                    .pop({
                                        type: 'error',
                                        title: 'Error',
                                        body: err.data,
                                        showCloseButton: true
                                    });
                            });
                    }
                };
            }
        ]);
