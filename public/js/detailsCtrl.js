// ----------------------------------------------------
// DetailsController
// ----------------------------------------------------

angular.module('myApp').controller('DetailsController', ['$scope', '$http', '$routeParams', 'appVars', 'socket', function ($scope, $http, $routeParams, appVars, socket) {

  this.appVars = appVars;
  this.socket = socket;

  $scope.allowExternalControl = appVars.globalOptions.allowExternalControl;

  // Listen for messages from server

  // Note: I should move my sockets into an Angular-style socket factory
  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });

  socket.on("galaxyDetails", function (data) {
    $scope.galaxyDetails = data[0];
    $scope.extraHTML = '<< Back to library';
    $scope.$apply();

    if (appVars.globalOptions.isControlNode === 'true') {
      $scope.sendOSC();
    }
  });

  socket.on("messageOSC", function (message) {
    var galaxyName = message.substring(1, message.length);
    console.log('OSC message received by client: ' + galaxyName);
    if (galaxyName !== $routeParams.itemId && appVars.globalOptions.allowExternalControl === 'true') {
      socket.emit('galaxyDetailsRequest', galaxyName);
    }
  });

  // Listen for messages from view

  $scope.sendOSC = function () {
    var msgOSC = '/' + $scope.galaxyDetails._Common_Name;
    console.log('send msg to server, requesting OSC send');
    socket.emit('messageOSC', msgOSC);
  };

  // Initialize view

  socket.emit('galaxyDetailsRequest', $routeParams.itemId);

}]);
