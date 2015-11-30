(function () {
'use strict'

angular.module('klarifyApp')
.directive('kBlockButton', function () {
  return {
    templateUrl: 'app/directives/kBlockButton/kBlockButton.html',
    restrict : 'EA',
    scope: {
      sref: '@',
      title: '@',
      body: '@',
      randomNumber: '='
    },
    link: function (scope, element, attrs) {
      
    }
  }
});

})();