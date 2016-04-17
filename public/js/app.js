// ----------------------------------------------------
//  Main application script
// ----------------------------------------------------

global.jQuery = $ = require('jquery');
require("angular-ui-bootstrap");

//var users = require('./galaxyInfo');
//var fs = require('browserify-fs');
//var path = require('path');
//var http = require('http');

// create main Angular module
var myApp = angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'ngAnimate'
])
.run(['utilities', 'socket', function(utilities, socket) {
  socket.emit('login');
}])
// application 'globals' using Value
.value('appVars', {
  searchTerms: {
    group: 'Leo_II',
    galaxyType: '',
    /* '' = all types */
    orderBy: 'Distance',
    direction: '',
    /* '' = ascending */
    displayStyle: 'Tiles',
    resultsPerPage: '20',
    resultsStartPosition: 0
  },
  globalOptions: {
    listSelectStyle: 'SingleClick',
    allowExternalControl: 'true',
    isControlNode: 'true'
  }
})
.config(['$routeProvider', function ($routeProvider) {
  // ---- init Angular route provider ----
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
// TIP: Can define an application Constant var by appending the .constant
// e.g.  ]).constant('APP_CONSTANT', 'some value');


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
