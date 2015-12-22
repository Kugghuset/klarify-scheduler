'use strict';

angular
    .module('klarifyApp')
    .controller(
        'navbarCtrl',
        [
            '$scope',
            '$rootScope',
            'Auth',
            '$location',
            function($scope, $rootScope, Auth, $location) {
                $rootScope.$on('AuthLoggedIn', function () {
                    $location.path('/user/dashboard');
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.isLoggedIn = Auth.isLoggedIn();
                });

                $scope.logout = function () {
                    Auth.logout();
                    $location.path('/');
                }
            }
        ]);
