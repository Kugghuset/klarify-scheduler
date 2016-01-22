'use strict';

window.$ = window.jQuery = require('../../bower_components/jquery/dist/jquery');

require('../../bower_components/angular');
require('../../bower_components/bootstrap/dist/js/bootstrap.js');
require('../../bower_components/angular-ui-router/release/angular-ui-router');
require('../../bower_components/angular-cookies');
require('../../bower_components/AngularJS-Toaster/toaster');
require('../../bower_components/angular-bootstrap/ui-bootstrap-tpls');
require('../../bower_components/angular-ui-switch/angular-ui-switch');
require('../../bower_components/angular-permission/dist/angular-permission');
require('../../bower_components/angular-animate/angular-animate');

require('lodash');
require('later');

angular
    .module('klarifyApp', [
        'ui.router',
        'ngCookies',
        'toaster',
        'ui.bootstrap',
        'uiSwitch',
        'permission',
        'ngAnimate'
    ])
    .run(
        [
            'Permission',
            'Auth',
            '$q',
            function (Permission, Auth, $q) {
                Permission
                    // public role.
                    .defineRole('public', function () {
                        var deferred = $q.defer();

                        if (!Auth.isLoggedIn()) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                        return deferred.promise;
                    })
                    //admin role.
                    .defineRole('user', function () {
                        var deferred = $q.defer();

                        if(Auth.getCurrentUser()) {
                            deferred.resolve();
                        } else {
                            Auth
                                .getSessionUser()
                                .then(function (user) {
                                    Auth.setUser(user);
                                    deferred.resolve();
                                })
                                .catch(function () {
                                    deferred.reject();
                                });
                        }

                        return deferred.promise;
                    })
            }
        ]
    )
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider) {

            ///////////////////PUBLIC ROUTES//////////////////////////
            $stateProvider.state('home', {
                url: '/home',
                templateUrl: './views/public/home.html',
                data: {
                    permissions: {
                        only: ['public', 'user']
                    }
                }
            });

            $stateProvider.state('register', {
                url: '/register',
                templateUrl:'./views/public/register.html',
                controller: 'RegisterCtrl',
                data: {
                    permissions: {
                        only: ['public']
                    }
                }
            });

            $stateProvider.state('login', {
                url: '/login',
                templateUrl: './views/public/login.html',
                controller: 'LoginCtrl',
                data: {
                    permissions: {
                        only: ['public']
                    }
                }
            });

            ///////////////////USER ROUTES///////////////////////////
            $stateProvider.state('dashboard', {
                url: '/user/dashboard',
                templateUrl: './views/user/dashboard.html',
                controller: 'dashboardCtrl',
                data: {
                    permissions: {
                        only: ['user']
                    }
                }
            });

            $stateProvider.state('endpoints', {
                url: '/user/endpoints',
                templateUrl: './views/user/endpoints.html',
                controller: 'endpointsCtrl',
                data: {
                    permissions: {
                        only: ['user']
                    }
                }
            });

            $stateProvider.state('presets', {
                url: '/user/presets',
                templateUrl: './views/user/presets.html',
                controller: 'presetsCtrl',
                data: {
                    permissions: {
                        only: ['user']
                    }
                }
            });

            //otherwise redirect to homepage
            $urlRouterProvider
                .otherwise('/home');

            // Adds authInterceptor to http requests
            $httpProvider.interceptors.push('authInterceptor');
        }
    ]);

// Services
var services = require.context('./services', true, /.js$/);
services.keys().forEach(services);

// Directives
var directives = require.context('./directives', true, /.js$/);
directives.keys().forEach(directives);

// Filters
//var filters = require.context('./filters', true, /.js$/);
//filters.keys().forEach(filters);

// Controllers
var controllers = require.context('./controllers', true, /.js$/);
controllers.keys().forEach(controllers);

