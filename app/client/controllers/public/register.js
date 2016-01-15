'use strict';

angular.module('klarifyApp')
    .controller(
        'RegisterCtrl',
        [
            '$scope',
            '$http',
            'toaster',
            '$cookies',
            '$state',
            function ($scope, $http, toaster, $cookies, $state) {
                $scope.emailPattern  = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;

                $scope.register = function () {

                    $http
                        .post('/api/accounts/register', $scope.user)
                        .then(function (success) {
                            $scope.user = {};
                            $scope.regForm.$setPristine();
                            $cookies.put('token', success.data);
                            toaster.pop({
                                type: 'success',
                                title: 'Success',
                                body: 'You have registered successfully!'
                            });
                            $state.go('dashboard');
                        })
                        .catch(function (err) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: err.data,
                                showCloseButton: true
                            });
                        });
                };
            }
        ]);
