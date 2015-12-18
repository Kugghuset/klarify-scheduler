'use strict';

angular.module('klarifyApp')
    .controller('RegisterCtrl', ['$scope', function ($scope) {
        $scope.emailPattern  = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;
    }]);
