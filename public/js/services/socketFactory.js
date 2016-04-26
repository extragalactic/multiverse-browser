var socketio = require('socket.io-client');

angular.module('myApp').factory('socket', function ($rootScope) {
   var socketPath = "http://" + MULTIVERSE_SERVER_IP + ":" + MULTIVERSE_SERVER_PORT;
   console.log('creating socket connection: ' + socketPath);
   var socket = socketio.connect(socketPath);

   return {
     on: function (eventName, callback) {
         socket.on(eventName, function () {
             var args = arguments;
             $rootScope.$apply(function () {
                 callback.apply(socket, args);
             });
         });
     },
     emit: function (eventName, data, data2, callback) {
         socket.emit(eventName, data, data2, function () {
             var args = arguments;
             $rootScope.$apply(function () {
                 if (callback) {
                     callback.apply(socket, args);
                 }
             });
         });
     },
     removeAllListeners: function (eventName, callback) {
       socket.removeAllListeners(eventName, function() {
           var args = arguments;
           $rootScope.$apply(function () {
             callback.apply(socket, args);
           });
     });
   }
  };
});
