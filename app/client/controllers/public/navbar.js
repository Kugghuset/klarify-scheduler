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
                    $scope.user = Auth.getCurrentUser();

                });

                $rootScope.$on('$stateChangeSuccess', function () {
                    $scope.isLoggedIn = Auth.isLoggedIn();
                });

                $scope.logoClick = function () {
                    if(Auth.isLoggedIn()) {
                        return $location.path('/user/dashboard');
                    }

                    $location.path('#');
                };

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
