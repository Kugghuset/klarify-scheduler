'use strict';

angular
    .module('klarifyApp')
    .controller(
        'presetsCtrl',
        [
            '$scope',
            '$http',
            'toaster',
            'Auth',
            function ($scope, $http, toaster, Auth) {
                $scope.view = 'defaultView';
                $scope.preset = {};
                $scope.presets = [];
                $scope.limit = 10;
                $scope.showLoadMore = false;

                $scope.loadPresets = function () {
                    $http
                        .get('/api/presets', {params: {skip: $scope.presets.length, limit: $scope.limit}})
                        .then(function (success) {
                            $scope.presets = $scope.presets.concat(success.data);
                            $scope.showLoadMore = success.data.length === 10;
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

                $scope.loadPresets();

                $scope.createPreset = function () {
                    $scope.view = 'formView';
                };

                $scope.cancel = function () {
                    $scope.view = 'defaultView';
                    $scope.preset = {};
                };

                $scope.save = function () {
                    var payload = {
                        name: $scope.preset.name,
                        value: $scope.preset.value,
                        userId: Auth.getCurrentUser()._id
                    };
                    $http
                        .post('/api/presets', payload)
                        .then(function (success) {

                            $scope.presets.push(success.data);
                            $scope.editPreset(success.data);
                            toaster
                                .pop({
                                    type: 'success',
                                    title: 'Success',
                                    body: "Preset saved successfully.",
                                    showCloseButton: true
                                });
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

                $scope.editPreset = function (preset) {
                    $scope.view = 'editView';
                    $scope.preset = preset;
                };

                $scope.deletePreset = function (presetId) {
                    if(confirm("Are you sure?")) {
                        $http
                            .delete('/api/presets', {params: {id: presetId}})
                            .then(function () {
                                $scope.presets = _.chain($scope.presets)
                                                    .filter(function (preset) {
                                                        return preset._id !== presetId;
                                                    })
                                                    .value();
                                $scope.cancel();

                                toaster
                                    .pop({
                                        type: 'info',
                                        title: 'Info',
                                        body: 'Deleted Successfully',
                                        showCloseButton: true
                                    });
                            })
                            .catch(function (error) {
                                toaster
                                    .pop({
                                        type: 'error',
                                        title: 'Error',
                                        body: error.body,
                                        showCloseButton: true
                                    });
                            });
                    }
                };

                $scope.update = function () {
                    $scope.preset.userId = Auth.getCurrentUser()._id;
                    $http
                        .put('/api/presets', $scope.preset)
                        .then(function () {
                            $scope.editPreset($scope.preset);
                            toaster
                                .pop({
                                    type: 'success',
                                    title: 'Success',
                                    body: "Preset updated successfully.",
                                    showCloseButton: true
                                });
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

            }
        ]);
