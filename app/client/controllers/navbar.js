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
            'toaster',
            function($scope, $rootScope, Auth, $location, toaster) {
                $rootScope.$on('AuthLoggedIn', function () {
                    $location.path('/user/dashboard');
                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.isLoggedIn = Auth.isLoggedIn();
                });

                $scope.logout = function () {
                    Auth.logout();
                    toaster.pop({
                        type: 'info',
                        title: 'Info',
                        body: 'Logged out',
                        showCloseButton: true
                    });
                    $location.path('/');
                }
            }
        ]);
