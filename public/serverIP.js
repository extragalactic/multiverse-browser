var MULTIVERSE_SERVER_IP = "192.168.1.90";
var MULTIVERSE_SERVER_PORT = 3334;

(function() {

   var settings = {MULTIVERSE_SERVER_IP : MULTIVERSE_SERVER_IP, MULTIVERSE_SERVER_PORT : MULTIVERSE_SERVER_PORT}

   if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
      module.exports = settings;
   else {
      window.multiverseBrowserSettings = settings;
   }
})();
