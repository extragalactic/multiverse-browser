angular.module('myApp').factory('utilities', ['$rootScope', function ($rootScope) {
   return {
     add: function (val1, val2) {
       return val1 + val2;
     },
     subtract: function (val1, val2) {
       return val1 - val2;
     }
   };
}]);
