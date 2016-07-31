// ----------------------------------------------------
// HomeController
// ----------------------------------------------------

angular.module('myApp').controller('HomeController', ['$scope', '$http', 'appVars', function ($scope, $http, appVars) {
  "use strict";

  this.appVars = appVars;

  $scope.myInterval = 5000;
  $scope.noWrapSlides = false;
  $scope.active = 0;

  var slides = [
    {image: 'images/slides/multiverse-slide-5.jpg', text: '', id: 0},
    {image: 'images/slides/multiverse-slide-16.jpg', text: '', id: 1},
    {image: 'images/slides/multiverse-slide-1.jpg', text: '', id: 2},
    {image: 'images/slides/multiverse-slide-2.jpg', text: '', id: 3},
    {image: 'images/slides/multiverse-slide-6.jpg', text: '', id: 4},
    {image: 'images/slides/multiverse-slide-7.jpg', text: '', id: 5},
    {image: 'images/slides/multiverse-slide-15.jpg', text: '', id: 6}
  ];
  $scope.slides = slides;

}]);
