angular
    .module('klarifyApp')
    .controller(
        'LoginCtrl',
        [
            '$scope',
            '$http',
            '$cookies',
            '$location',
            function ($scope, $http, $cookies, $location) {
                $scope.login = function () {
                    $http
                        .post('/api/session/sign-in', $scope.user)
                        .then(function (success) {
                            $scope.user = {};
                            $scope.loginForm.$setPristine();
                            $cookies.put('token', success.data);
                            $location.path('/user/dashboard');
                        })
                        .catch(function (err) {
                            return console.log('error:', err);
                        });
                }
            }
        ]);
