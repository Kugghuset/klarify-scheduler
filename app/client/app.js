'use strict';

window.$ = window.jQuery = require('../../bower_components/jquery/dist/jquery');
require('../../bower_components/angular');
require('../../bower_components/angular-ui-router/release/angular-ui-router');
require('../../bower_components/angular-cookies');
require('../../bower_components/angular-superagent');
require('../../bower_components/bootstrap/dist/js/bootstrap.js');

angular
    .module('klarifyApp', [
        'ui.router',
        'ngCookies'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider) {

            $urlRouterProvider
                .otherwise('/home');

            $stateProvider.state('home', {
                url: '/home',
                template: require('./views/public/home.jade'),
                controller: 'HomeCtrl'
            });
            $stateProvider.state('register', {
                url: '/register',
                template: require('./views/public/register.jade'),
                controller: 'RegisterCtrl'
            });
            $stateProvider.state('login', {
                url: '/login',
                template: require('./views/public/login.jade'),
                controller: 'RegisterCtrl'
            });
            $stateProvider.state('forgot-password', {
                url: '/forgot-password',
                template: require('./views/public/forgot-password.jade'),
                controller: 'RegisterCtrl'
            });

            // Adds authInterceptor to http requests
            $httpProvider.interceptors.push('authInterceptor');
        }
    ]);

// Services
var services = require.context('./services', true, /.js$/);
services.keys().forEach(services);

// Directives
//var directives = require.context('./directives', true, /.js$/);
//directives.keys().forEach(directives);

// Filters
//var filters = require.context('./filters', true, /.js$/);
//filters.keys().forEach(filters);

// Controllers
var controllers = require.context('./controllers', true, /.js$/);
controllers.keys().forEach(controllers);

