'use strict';

angular
    .module('klarifyApp')
    .controller(
        'dashboardCtrl',
        [
            '$scope',
            'Auth',
            '$http',
            'toaster',
            function ($scope, Auth, $http, toaster) {

                $http
                    .get('/api/resources/count')
                    .then(function (success) {
                        $scope.resourceCount = success.data.resources;
                        $scope.methodCount = success.data.methods;
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
        ]);
