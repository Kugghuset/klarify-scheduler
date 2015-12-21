angular
    .module('klarifyApp')
    .controller(
        'LoginCtrl',
        [
            '$scope',
            '$http',
            '$cookies',
            function ($scope, $http, $cookies) {
                $scope.login = function () {
                    $http
                        .post('/api/session/sign-in', $scope.user)
                        .then(function (success) {
                            $scope.user = {};
                            $scope.loginForm.$setPristine();
                            $cookies.put('token', success.data);

                            console.log($cookies.get('token'));

                            $http
                                .get('/api/session')
                                .then(function() {
                                    console.log(arguments);
                                });
                        })
                        .catch(function (err) {
                            return console.log('error:', err);
                        });
                }
            }
        ]);
