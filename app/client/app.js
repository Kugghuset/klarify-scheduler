'use strict';

window.$ = window.jQuery = require('../../bower_components/jquery/dist/jquery');
require('lodash');
require('../../bower_components/angular');
require('../../bower_components/angular-ui-router/release/angular-ui-router');
require('../../bower_components/angular-cookies');
require('../../bower_components/bootstrap/dist/js/bootstrap.js');
require('../../bower_components/AngularJS-Toaster/toaster');
require('../../bower_components/angular-bootstrap/ui-bootstrap-tpls');
require('../../bower_components/ace-builds/src-noconflict/ace');
require('../../bower_components/ace-builds/src-noconflict/mode-javascript');
require('../../bower_components/angular-ui-ace/ui-ace');

angular
    .module('klarifyApp', [
        'ui.router',
        'ngCookies',
        'toaster',
        'ui.bootstrap',
        'ui.ace'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider) {

            ///////////////////PUBLIC ROUTES//////////////////////////
            $stateProvider.state('home', {
                url: '/home',
                templateUrl: './views/public/home.html'
            });

            $stateProvider.state('register', {
                url: '/register',
                templateUrl:'./views/public/register.html',
                controller: 'RegisterCtrl'
            });

            $stateProvider.state('login', {
                url: '/login',
                templateUrl: './views/public/login.html',
                controller: 'LoginCtrl'
            });

            ///////////////////USER ROUTES///////////////////////////
            $stateProvider.state('dashboard', {
                url: '/user/dashboard',
                templateUrl: './views/user/dashboard.html',
                controller: 'dashboardCtrl'
            });

            $stateProvider.state('endpoints', {
                url: '/user/endpoints',
                templateUrl: './views/user/endpoints.html',
                controller: 'endpointsCtrl'
            });

            $stateProvider.state('crons', {
                url: '/user/crons',
                templateUrl: './views/user/crons.html',
                controller: ''
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

