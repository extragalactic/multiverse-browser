// ----------------------------------------------------
//  ListController
// ----------------------------------------------------

//global.jQuery = $ = require('jquery');


// ListController
angular.module('myApp').controller('ListController', ['$scope', '$http', '$window', '$timeout', 'socket', 'appVars', function ($scope, $http, $window, $timeout, socket, appVars) {
  "use strict";

  this.socket = socket;
  this.appVars = appVars;
  var lastImageSelected = '';
  var resetPageScrollPos = false;

  $scope.isControlNode = appVars.globalOptions.isControlNode;

  // setup for the mini-slide carousel
  $scope.myInterval = 0;
  $scope.noWrapSlides = false;
  $scope.slides=[];
  $scope.active = 0;

  $scope.isNavbarCollapsed = false;

  $scope.$on('$destroy', function (event) {
    appVars.scrollPos = $window.document.documentElement.scrollTop || $window.document.body.scrollTop;

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
        host: MULTIVERSE_SERVER_IP
      },
      client: {
        port: 3334,
        host: MULTIVERSE_SERVER_IP
      }
    });
  });

  // get returned list of galaxies
  socket.on("galaxyList", function (data) {
    $scope.galaxies = data;
    appVars.galaxyList = data;
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

    // wait until the DOM has rendered, then scroll to saved page position
    if(resetPageScrollPos===true) {
      appVars.scrollPos = 0;
    } else {
      $timeout(function () {
        $window.document.documentElement.scrollTop = $window.document.body.scrollTop = appVars.scrollPos;
      });
    }
    // set default selected galaxy (for the Details page)
    appVars.defaultDetailsItem = $scope.galaxies[0]._Common_Name;

    // update images for slides widget
    $scope.slides.length=0;
    for(var i=0; i < data.length; i++) {
      $scope.slides[i] = {image: "images/galaxies 150/" + data[i].ImageFileJPG, id: i};
    }
    $scope.active = 0;

    // a timeout is necessary since I couldn't resolve the weird flash that was happening on the initial load
    var slideDisplayTimeout = setTimeout(function() {
      $('.carousel-fade').fadeIn(300);
      $scope.myInterval = 300;
      $scope.$apply();
      clearTimeout(slideDisplayTimeout);
    }, 700);

  });

  socket.on("galaxyTypes", function (data) {
    $scope.galaxyTypes = [];
    for (var i = 0; i < data.length; i++) {
      $scope.galaxyTypes.push(data[i]);
    }
    $scope.galaxyType = appVars.searchTerms.galaxyType;

    console.log('client requesting galaxy list');
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  });

  // currently this is used during initialization only
  // (which triggers a call to get the Local Group galaxies list, and sets view start values)
  socket.on("galaxyGroups", function (data) {
    $scope.galaxyGroups = [];
    //
    // .... TODO: this backslash remover should be inside a "utils" service, since i need to use it in the detailsCtrl file
    //
    for (var i = 0; i < data.length; i++) {
      var item = {
        name: data[i],
        name_cleaned: data[i].replace(/_/g, ' ')
      };
      $scope.galaxyGroups.push(item);
    }
    $scope.galaxyGroup = appVars.searchTerms.group;

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
    resetPageScrollPos = true;
    appVars.searchTerms.group = $scope.galaxyGroup;
    appVars.searchTerms.resultsStartPosition = 0;
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  };

  $scope.changeTypeSelect = function () {
    resetPageScrollPos = true;
    console.log('galaxy type: ' + $scope.galaxyType);
    appVars.searchTerms.galaxyType = $scope.galaxyType;
    appVars.searchTerms.resultsStartPosition = 0;
    socket.emit('galaxyListRequest', $scope.galaxyGroup, $scope.galaxyType);
  };

  $scope.changeSortDirection = function () {
    resetPageScrollPos = true;
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
    // Manually set the navbar to Details (this is a hack; I shouldn't be modifying the DOM)
    $('.navbar-nav li:first').next().addClass('active').siblings().removeClass('active');
  };

  // when the user clicks the Return to Top button
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

  // begin by getting initial group list (which then calls the initial galaxy list request)
  socket.emit('galaxyGroupsRequest');

}]);
