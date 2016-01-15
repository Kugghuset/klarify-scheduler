'use strict';

angular
    .module('klarifyApp')
    .controller(
        'navbarCtrl',
        [
            '$scope',
            '$rootScope',
            'Auth',
            '$state',
            'toaster',
            '$http',
            function($scope, $rootScope, Auth, $state, toaster) {
                $scope.user = null;

                $scope.$on('$stateChangeSuccess', function () {
                    $scope.user = Auth.getCurrentUser();
                });

                $scope.logoClick = function () {
                    if(Auth.isLoggedIn()) {
                        return $state.go('dashboard');
                    }

                    $state.go('home');
                };

                $scope.logout = function () {
                    Auth.logout();
                    $scope.user = null;

                    toaster.pop({
                        type: 'info',
                        title: 'Info',
                        body: 'Logged out',
                        showCloseButton: true
                    });
                    $state.go('login');
                }
            }
        ]);
