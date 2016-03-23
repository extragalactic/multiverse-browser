// ----------------------------------------------------
//  Controller code (for all pages)
// ----------------------------------------------------

global.jQuery = $ = require('jquery');
require('ng-range-filter');

//require('socket.io-client');
//var users = require('./galaxyInfo');
//var fs = require('browserify-fs');

var galacticController = angular.module('galacticController', [
  'ngAnimate',
  'ui.bootstrap'
]);

// ListController
galacticController.controller('ListController', ['$scope', '$http', 'socket', 'appVars', function ($scope, $http, socket, appVars) {

  this.socket = socket;
  this.appVars = appVars;
  var lastImageSelected = '';

  $scope.isControlNode = appVars.globalOptions.isControlNode;

  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });

  // ---------------------------------------------------
  // listen for socket messages from server

  // hmmm... this logic is suspicious since it will do a config for every client connection

  socket.on('connect', function () {
    // sends to socket.io server the host/port of oscServer and oscClient
    socket.emit('config', {
      server: {
        port: 3333,
        host: '192.168.1.65'
      },
      client: {
        port: 3334,
        host: '192.168.1.65'
      }
    });
  });

  // get returned list of galaxies
  socket.on("galaxyList", function (data) {
    $scope.galaxies = data;
    $scope.numGalaxies = data.length;

    $scope.galaxyOrder = appVars.searchTerms.orderBy;
    $scope.changeOrderBy();

    $scope.selectedListStyle = appVars.searchTerms.displayStyle;
    $scope.changeListStyle();

    $scope.resultsPerPage = appVars.searchTerms.resultsPerPage;
    $scope.limitNum = parseInt(appVars.searchTerms.resultsPerPage);
    $scope.limitStart = appVars.searchTerms.resultsStartPosition;
    $scope.changeResultsPerPage();

    if ($scope.numGalaxies < $scope.limitNum) {
      $('.prevNextButtons').addClass('hidden');
    } else {
      $('.prevNextButtons').removeClass('hidden');
    }

    $scope.direction = appVars.searchTerms.direction;

    $scope.$apply();
  });

  socket.on("galaxyTypes", function (data) {
    $scope.galaxyTypes = [];
    for (var i = 0; i < data.length; i++) {
      $scope.galaxyTypes.push(data[i]);
    }
    $scope.galaxyType = appVars.searchTerms.galaxyType;
    $scope.$apply();

    console.log('client requesting galaxy list');
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  });

  // currently this is used during initialization only
  // (which triggers a call to get the Local Group galaxies list, and sets view start values)
  socket.on("galaxyGroups", function (data) {
    $scope.galaxyGroups = [];
    for (var i = 0; i < data.length; i++) {
      var item = {
        name: data[i],
        name_cleaned: data[i].replace(/_/g, ' ')
      };
      $scope.galaxyGroups.push(item);
    }
    $scope.galaxyGroup = appVars.searchTerms.group;
    $scope.$apply();

    console.log('client requesting galaxy types');
    socket.emit('galaxyTypeRequest');
  });

  socket.on("messageOSC", function (message) {
    console.log('OSC message received by client: ' + message);
  });

  // ---------------------------------------------------
  // listen for messages from view

  $scope.changeListStyle = function () {
    appVars.searchTerms.displayStyle = $scope.selectedListStyle;

    if ($scope.selectedListStyle === 'List') {
      $('.multiList ul').removeClass('galaxyList');
      $('.multiList ul').addClass('galaxyListLinear');
      $scope.showFlags.all = true;
    } else {
      $('.multiList ul').removeClass('galaxyListLinear');
      $('.multiList ul').addClass('galaxyList');
      $scope.showFlags.all = false;
    }
  };

  $scope.changeOrderBy = function () {
    appVars.searchTerms.orderBy = $scope.galaxyOrder;

    $scope.showFlags.distance = $scope.showFlags.type = $scope.showFlags.size = false;

    if ($scope.galaxyOrder === 'Common_Name') {
      $scope.showFlags.name = true;
    } else if ($scope.galaxyOrder === 'Distance') {
      $scope.showFlags.distance = true;
    } else if ($scope.galaxyOrder === 'Type') {
      $scope.showFlags.type = true;
    } else if ($scope.galaxyOrder === 'Diameter') {
      $scope.showFlags.size = true;
    }
  };

  $scope.changeGroupSelect = function () {
    appVars.searchTerms.group = $scope.galaxyGroup;
    appVars.searchTerms.resultsStartPosition = 0;
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  };

  $scope.changeTypeSelect = function () {
    appVars.searchTerms.galaxyType = $scope.galaxyType;
    appVars.searchTerms.resultsStartPosition = 0;
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  };

  $scope.changeSortDirection = function () {
    appVars.searchTerms.direction = $scope.direction;
  };

  $scope.changeResultsPerPage = function () {
    appVars.searchTerms.resultsPerPage = $scope.resultsPerPage;
    $scope.limitNum = parseInt(appVars.searchTerms.resultsPerPage);

    var showingEndValue = $scope.limitStart + $scope.limitNum;
    if (showingEndValue > $scope.galaxies.length) {
      showingEndValue = $scope.galaxies.length;
    }
    $scope.showingTextBox = '(showing ' + ($scope.limitStart + 1) + ' to ' + showingEndValue + ')';
  };

  $scope.prevPage = function () {
    $scope.limitStart -= parseInt($scope.limitNum);
    if ($scope.limitStart < 0) {
      $scope.limitStart = 0;
    }
    appVars.searchTerms.resultsStartPosition = $scope.limitStart;
    $scope.changeResultsPerPage();
  };

  $scope.nextPage = function () {
    if ($scope.limitStart + parseInt($scope.limitNum) < $scope.galaxies.length) {
      $scope.limitStart += parseInt($scope.limitNum);
      appVars.searchTerms.resultsStartPosition = $scope.limitStart;
      $scope.changeResultsPerPage();
    }
  };

  $scope.onGalaxyClicked = function (itemName) {
    if (appVars.globalOptions.listSelectStyle === 'SingleClick') {
      lastImageSelected = '';
      window.location.href = '#/details/' + itemName;
    } else {
      if (itemName === lastImageSelected) {
        lastImageSelected = '';
        window.location.href = '#/details/' + itemName;
      } else {
        lastImageSelected = itemName;
        if (appVars.globalOptions.isControlNode === 'true') {
          var msgOSC = '/' + itemName;
          console.log('send OSC from List');
          socket.emit('messageOSC', msgOSC);
        }
      }
    }
  };

  $scope.returnToTop = function () {
    scroll(0, 0);
  };

  // initialize vars
  $scope.showFlags = {
    all: true,
    distance: false,
    group: false,
    type: false,
    size: false
  };

  // get initial group list (which then calls the initial galaxy list request)
  //console.log("requesting galaxy group list");
  socket.emit('galaxyGroupsRequest');
}]);

// DetailsController
galacticController.controller('DetailsController', ['$scope', '$http', '$routeParams', 'appVars', 'socket', function ($scope, $http, $routeParams, appVars, socket) {

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

// VideoController
galacticController.controller('VideoController', ['$scope', '$http', function ($scope, $http) {

}]);

// AboutController
galacticController.controller('AboutController', ['$scope', '$http', function ($scope, $http) {

}]);

// OptionsController
galacticController.controller('OptionsController', ['$scope', '$http', 'appVars', function ($scope, $http, appVars) {

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

// HeaderController
galacticController.controller('HeaderController', ['$scope', '$http', function ($scope, $http) {

  $scope.isActive = function (viewLocation) {
    var active = (viewLocation === $location.path());
    return active;
  };
}]);

/* An example of using $routeParams info ...

  $http.get('js/data.json').success(function(data) {
      $scope.galaxies = data.galaxyInfo;
      $scope.whichItem = $routeParams.itemId;

      if($routeParams.itemId > 0) {
          $scope.prevItem = Number($routeParams.itemId) - 1;
      } else {
          $scope.prevItem = $scope.galaxies.length - 1;
      }
      if($routeParams.itemId < $scope.galaxies.length - 1) {
          $scope.nextItem = Number($routeParams.itemId) + 1;
      } else {
          $scope.nextItem = 0;
      }

  });
 */
