'use strict';

angular.module('klarifyApp')
    .controller(
        'RegisterCtrl',
        [
            '$scope',
            '$http',
            function ($scope, $http) {
                $scope.emailPattern  = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;

                $scope.register = function () {

                    $http
                        .post('/api/accounts/register', $scope.user)
                        .then(function (success) {
                            $scope.user = {};
                            $scope.regForm.$setPristine();
                            console.log('success:', success);
                        })
                        .catch(function (err) {
                            return console.log('error:', err);
                        });
                }
            }
        ]);
