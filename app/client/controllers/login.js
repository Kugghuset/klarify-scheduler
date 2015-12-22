angular
    .module('klarifyApp')
    .controller(
        'LoginCtrl',
        [
            '$scope',
            '$http',
            '$cookies',
            '$location',
            'toaster',
            function ($scope, $http, $cookies, $location, toaster) {
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
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: err.data,
                                showCloseButton: true
                            });
                        });
                }
            }
        ]);
