// ----------------------------------------------------
//  Main application script for Galaxy Browser
// ----------------------------------------------------

require('angular');
require('angular-route');
require('angular-animate');
require('angular-ui-bootstrap');
require('angular-sanitize');
require('ui-select');


// create main Angular module
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'ui.select', 
  'ngSanitize'
])
.run(['socket', function(socket) {
  socket.emit('login');
}])
// application 'globals' using Value
.value('appVars', {
  searchTerms: {
    group: 'Ursa_Major',
    galaxyType: 'All', 
    orderBy: 'Distance',
    direction: '', /* '' = ascending */
    displayStyle: 'Tiles',
    resultsPerPage: '20',
    resultsStartPosition: 0
  },
  globalOptions: {
    listSelectStyle: 'SingleClick',
    allowExternalControl: 'true',
    isControlNode: 'true'
  },
    galaxyList: [],
    defaultDetailsItem: '',
  scrollPos: 0
})
  // ---- init Angular route provider ---
.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.
  when('/home', {
    templateUrl: 'partials/home.html',
    controller: 'HomeController'
  }).
  when('/list', {
    templateUrl: 'partials/list.html',
    controller: 'ListController'
  }).
  when('/details/:itemId', {
    templateUrl: 'partials/details.html',
    controller: 'DetailsController'
  }).
  when('/details', {
    templateUrl: 'partials/details.html',
    controller: 'DetailsController'
  }).
  when('/options', {
    templateUrl: 'partials/options.html',
    controller: 'OptionsController'
  }).
  when('/about', {
    templateUrl: 'partials/about.html',
    controller: 'AboutController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);
// TIP: Can define an application Constant var by appending the .constant
// e.g.  ]).constant('APP_CONSTANT', 'some value');

