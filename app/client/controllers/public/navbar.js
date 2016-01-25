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
            '$uibModal',
            function($scope, $rootScope, Auth, $state, toaster, $modal) {
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
                    $state.go('home');
                };

                $scope.openLoginModal = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: './views/public/login.html',
                        controller: 'LoginCtrl'
                    });
                };

                $scope.openRegisterModal = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: './views/public/register.html',
                        controller: 'RegisterCtrl'
                    });
                };
            }
        ]);
