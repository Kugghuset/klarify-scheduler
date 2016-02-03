'use strict';

angular
    .module('klarifyApp')
    .factory('authInterceptor', ['$q', '$cookies', '$location', function ($q, $cookies, $location) {
        return {
            // Add authorization token to headers
            request: function (config) {
                config.headers = config.headers || {};

                config.headers.authorization = 'Bearer ' + $cookies.get('token') || '';
                return config;
            },
            // Intercepts 401s and redirects to home
            responseError: function (response) {
                if (response.status === 401) {
                    $location.path('/login');
                    $cookies.remove('token');
                }

                return $q.reject(response);
            }
        }
    }]);
