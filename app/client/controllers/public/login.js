angular
    .module('klarifyApp')
    .controller(
        'LoginCtrl',
        [
            '$scope',
            '$http',
            '$cookies',
            '$state',
            'toaster',
            'Auth',
            function ($scope, $http, $cookies, $state, toaster, Auth) {
                $scope.login = function () {
                    $http
                        .post('/api/session/sign-in', $scope.user)
                        .then(function (success) {
                            $scope.user = {};
                            $scope.loginForm.$setPristine();
                            $cookies.put('token', success.data.token);
                            Auth.setUser(success.data.credentials);
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
                }
            }
        ]);
