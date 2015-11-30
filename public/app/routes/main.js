(function () {
'use strict'

angular.module('klarifyApp')
.config(['$stateProvider', function ($stateProvider) {
   $stateProvider.state('main', {
     templateUrl: 'app/routes/main.html',
     controller: 'MainCtrl'
   });
}])
.controller('MainCtrl', ['$scope', function ($scope) {
  
  $scope.example = 'Hello, Klarify!';
  
}]);

})();