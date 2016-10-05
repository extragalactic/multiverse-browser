// ----------------------------------------------------
// HeaderController
// ----------------------------------------------------

angular.module('myApp').controller('HeaderController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  "use strict";
  
  // create functionality for nav buttons
  $scope.isActive = function (viewLocation) {
    var active = ($location.path().indexOf(viewLocation) !== -1);
    return active;
  };
}]);
