// ----------------------------------------------------
//  Main application script
// ----------------------------------------------------

global.jQuery = $ = require('jquery');
require("angular-ui-bootstrap");
var socketio = require('socket.io-client');

//var users = require('./galaxyInfo');
//var fs = require('browserify-fs');
//var path = require('path');
//var http = require('http');

// init Angular
var myApp = angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngAnimate'
]);


// create Socket
console.log('--------------- creating socket connection ------------------');
var socket = socketio("http://192.168.1.67:3100");
socket.emit('login');

myApp.value('socket', socket);

// application 'globals' using Value
myApp.value('appVars', {
  searchTerms: {
    group: 'Local_Group',
    galaxyType: '',
    /* all types */
    orderBy: 'Distance',
    direction: '',
    /* ascending */
    displayStyle: 'List',
    resultsPerPage: '10',
    resultsStartPosition: 0
  },
  globalOptions: {
    listSelectStyle: 'SingleClick',
    allowExternalControl: 'true',
    isControlNode: 'true'
  }
});

// init Angular route provider
myApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.
  when('/list', {
    templateUrl: 'partials/list.html',
    controller: 'ListController'
  }).
  when('/details/:itemId', {
    templateUrl: 'partials/details.html',
    controller: 'DetailsController'
  }).
  when('/video', {
    templateUrl: 'partials/video.html',
    controller: 'VideoController'
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
    redirectTo: '/list'
  });
  //console.log('init router');
}]);

// Note: it appears that the ui-angular scripts are not fully working.
// I must manually add behavior to the buttons.

// initialize navbar button behavior
$(document).on('click', '.navbar-nav li', function (e) {
  $(this).addClass('active').siblings().removeClass('active');
});
$(document).on('click', '.navbar-brand', function (e) {
  $(this).addClass('active');
  $('.navbar-nav li:first').addClass('active').siblings().removeClass('active');
});

// init hamburger button
$(document).on('click', '#menuCollapseButton', function (e) {
  if ($('#navigationBar').hasClass('collapse')) {
    $('#navigationBar').removeClass('collapse');
  } else {
    $('#navigationBar').addClass('collapse');
  }
});
