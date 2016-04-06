// ----------------------------------------------------
// OptionsController
// ----------------------------------------------------

angular.module('myApp').controller('OptionsController', ['$scope', '$http', 'appVars', function ($scope, $http, appVars) {

  this.appVars = appVars;
  $scope.listSelectStyle = appVars.globalOptions.listSelectStyle;
  $scope.allowExternalControl = appVars.globalOptions.allowExternalControl;
  $scope.isControlNode = appVars.globalOptions.isControlNode;

  $scope.changeListSelectStyle = function () {
    appVars.globalOptions.listSelectStyle = $scope.listSelectStyle;
  };
  $scope.changeAllowExternalControl = function () {
    appVars.globalOptions.allowExternalControl = $scope.allowExternalControl;
  };
  $scope.changeIsControlNode = function () {
    appVars.globalOptions.isControlNode = $scope.isControlNode;
    if (appVars.globalOptions.isControlNode === 'false') {
      $scope.listSelectStyle = 'SingleClick';
      appVars.globalOptions.listSelectStyle = $scope.listSelectStyle;
    }
  };

}]);
