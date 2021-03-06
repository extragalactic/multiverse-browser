// ----------------------------------------------------
// DetailsController
// ----------------------------------------------------

angular.module('myApp').controller('DetailsController', ['$scope', '$http', '$routeParams', '$document', 'appVars', 'socket', function ($scope, $http, $routeParams, $document, appVars, socket) {
  "use strict";

  this.appVars = appVars;
  this.socket = socket;

  // keep track of the next and previous galaxies in the current search list
  var indexPointers = {
    current: 0,
    next: 0,
    prev: 0
  };

  $scope.allowExternalControl = appVars.globalOptions.allowExternalControl;
  $scope.isGalaxyListEmpty = false;
  $scope.showHiddenImages = false; // delays showing image until loaded

  $scope.$on('$destroy', function (event) {
    socket.removeAllListeners();
  });

  // ----------------------------------------------------------
  // Listen for messages from server

  socket.on("galaxyDetails", function (data) {

    $scope.galaxyDetails = data[0];
    var galaxy = $scope.galaxyDetails;
    galaxy.Diameter_fulltext = galaxy.Diameter + ' kly';
    galaxy.Distance_fulltext = galaxy.Distance + ' mly';
    galaxy.RA_fulltext = galaxy.RA_h + 'h ' + galaxy.RA_m + 'm ' + galaxy.RA_s + 's';
    galaxy.Decl_fulltext = galaxy.Decl_h + 'd ' + galaxy.Decl_m + "' " + galaxy.Decl_s + '""';
    galaxy.ImageFile_fulltext = 'images/galaxies 150 (png)/' + galaxy.ImageFile;

    $scope.isGalaxyListEmpty = appVars.galaxyList.length > 0 ? false : true;

    // To prevent a visual flash, the picture thumbnail element is by default hidden, then shown once the data is loaded
    $scope.showHiddenImages = true;


    // build the search descriptor line of text
    if(!$scope.isGalaxyListEmpty) {
      var typeText = appVars.searchTerms.galaxyType === 'All' ? '' : appVars.searchTerms.galaxyType;
      galaxy.searchDescriptor = appVars.galaxyList.length + ' ' + typeText + ' galaxies';
      if(appVars.searchTerms.group !== '') {
        galaxy.searchDescriptor += ' in ';
        galaxy.searchDescriptor += appVars.searchTerms.group==='-'? "No Group": appVars.searchTerms.group;
        galaxy.searchDescriptor = galaxy.searchDescriptor.replace(/_/g, ' ');
      }
    } else {
      galaxy.searchDescriptor = "";
    }

    $scope.extraHTML = '<< Back to List';

    // find the next & previous galaxies in the search list (if it exists)
    if(!$scope.isGalaxyListEmpty) {  

      for (var i = 0, len = appVars.galaxyList.length; i < len; i++) {
        if(appVars.galaxyList[i].Common_Name == $scope.galaxyDetails.Common_Name) {
          indexPointers.current = i;
          indexPointers.prev = i-1;
          if(indexPointers.prev < 0) indexPointers.prev = appVars.galaxyList.length-1;
          indexPointers.next = i+1;
          if(indexPointers.next >= appVars.galaxyList.length) indexPointers.next = 0;
          break;
        }
      }
    }

    if (appVars.globalOptions.isControlNode === 'true') {
      $scope.sendOSC();
    }



  });

  // client receives an OSC message (from TouchDesigner)
  socket.on("messageOSC", function (message) {
    var galaxyName = message.substring(1, message.length);
    console.log('OSC message received by client: ' + galaxyName);
    if (galaxyName !== $routeParams.itemId && appVars.globalOptions.allowExternalControl === 'true') {
      socket.emit('galaxyDetailsRequest', galaxyName);
    }
  });

  // ----------------------------------------------------------
  // Listen for messages from view

  // user clicks the Return to List button
  $scope.returnToList = function () {
    window.location.href = '#/galaxies/';
  };

  // previous galaxy
  $scope.prevGalaxy = function () {
    if(appVars.galaxyList.length === 0) return;
    var itemName = appVars.galaxyList[indexPointers.prev]._Common_Name;
    window.location.href = '#/details/' + itemName;
  };

  // next galaxy
  $scope.nextGalaxy = function () {
    if(appVars.galaxyList.length === 0) return;
    var itemName = appVars.galaxyList[indexPointers.next]._Common_Name;
    window.location.href = '#/details/' + itemName;
  };


  // ----------------------------------------------------------
  // Private functions
  // (note: must refactor how private functions are handled)

  // Send the selected galaxy info out via OSC (to TouchDesigner)
  $scope.sendOSC = function () {
    var msgOSC = '/' + $scope.galaxyDetails._Common_Name;
    console.log('send msg to server, requesting OSC send');
    socket.emit('messageOSC', msgOSC);
  };

  // ----------------------------------------------------------
  // Initialize page with DB request

  if($routeParams.itemId===undefined && appVars.defaultDetailsItem==='') {
    window.location.href = '#/list/';
  } else {
    if($routeParams.itemId===undefined) {
      socket.emit('galaxyDetailsRequest', appVars.defaultDetailsItem);
    } else {
      appVars.defaultDetailsItem = $routeParams.itemId;
      socket.emit('galaxyDetailsRequest', $routeParams.itemId);
    }
  }

}]);
