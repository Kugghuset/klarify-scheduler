(function () {
'use strict'

angular.module('klarifyApp')
.config(['$stateProvider', function ($stateProvider) {
  $stateProvider.state('main.home', {
    url: '/home',
    templateUrl: 'app/routes/home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', function ($scope) {
  
  $scope.example = 'This is the home route!'; // Don't actually  use this
  
  $scope.randNum = Math.floor(Math.random() * 1000);
  
}]);

})();