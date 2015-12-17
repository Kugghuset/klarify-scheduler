'use strict';

angular
    .module('klarifyApp')
    .factory('authInterceptor', ['$q', '$cookies', '$location', function ($q, $cookies, $location) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};

                config.headers.Authorization = 'Bearer ' + $cookies.get('token') || '';
                return config;
            },
            // Intercepts 401s and redirects to home
            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/hem');
                    $cookies.remove('token');
                }

                return $q.reject(response);
            }
        }
    }])
    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        // Add location change interceptors here.
        // e.x. checking for LoggedIn or something.

        console.log(Auth.isLoggedIn() ? 'A token is stored as a cookie.' : 'No token stored.');

        $rootScope.$on('$stateChangeSuccess', function (event, net, params) {

            window.scrollTo(0,0);
        });
    }]);
