'use strict';

angular
    .module('klarifyApp')
    .directive('laterParse', function () {
        return {
            require: "ngModel",
            link: function (scope, elem, attr, ctrl) {
                ctrl.$parsers.push(function (value) {
                    var sched = later.parse.text(value);
                    if (sched.schedules.length) {
                        ctrl.$setValidity("laterParse", true);
                        return value;
                    } else {
                        ctrl.$setValidity("laterParse", false);
                    }
                });
            }
        }
    });
