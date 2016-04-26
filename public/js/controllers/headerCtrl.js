// ----------------------------------------------------
// HeaderController
// ----------------------------------------------------

angular.module('myApp').controller('HeaderController', ['$scope', '$http', function ($scope, $http) {
  "use strict";
  
  // create functionality for nav buttons
  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };
}]);
