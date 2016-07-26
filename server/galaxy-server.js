// ==========================================================
// galaxy-server.js
// ==========================================================

(function() {
"use strict";

// define external modules
var express = require("express");
var http = require("http");
var app = express();
var settings = require("./../public/serverIP");
var server = http.createServer(app).listen(settings.MULTIVERSE_SERVER_PORT);
var io = require("socket.io")(server);
var fs = require("fs");
var osc = require('node-osc');

// init MongoDB vars
var DBconnect = require("./modules/DBconnect");

// init application vars
var userList = [];
var oscServer, oscClient;

// set root folder for Express web server
app.use(express.static("./../public"));

// define handlers for all incoming messages
io.on("connection", function(socket) {

   // ----------------------------------------------------
   socket.on("config", function (obj) {

      console.log('configure OSC socket');
      oscServer = new osc.Server(obj.server.port, obj.server.host);
      oscClient = new osc.Client(obj.client.host, obj.client.port);
    //  oscClient.send('/status', socket.sessionId + ' connected');

      oscServer.on('message', function(msg, rinfo) {
        var OSCmsg = msg[2][0]; // trim the data out of the message
        console.log('OSC server received message: ' + OSCmsg);
        io.emit("messageOSC", OSCmsg);
      });
    });

    // ----------------------------------------------------
    socket.on("messageOSC", function(message) {
        console.log('sending OSC message to Multiverse: ' + message);
        oscClient.send(message);
    });

    // ----------------------------------------------------
    socket.on("galaxyListRequest", function(groupSelect, typeSelect) {
        //console.log("Received galaxy group " + groupSelect + " request, for type: " + typeSelect);
        DBconnect.findGalaxies(groupSelect, typeSelect, function(data) {
          cleanData(data);
          socket.emit('galaxyList', data);
        });
      });

    // ----------------------------------------------------
    socket.on("galaxyGroupsRequest", function() {
      console.log('find galaxy groups');
      DBconnect.findGalaxyGroups(function(data) {
          console.log('emiting galaxy groups');
          socket.emit('galaxyGroups', data);
      });
    });

    // ----------------------------------------------------
    socket.on("galaxyTypeRequest", function() {
      console.log('find galaxy types');
      DBconnect.findGalaxyTypes(function(data) {
          console.log('emiting galaxy types');
          socket.emit('galaxyTypes', data);
      });
    });

    // ----------------------------------------------------
    socket.on("galaxyDetailsRequest", function(searchData) {
      DBconnect.findGalaxyDetails(searchData, function(data) {
          cleanData(data);
          socket.emit('galaxyDetails', data);
      });
    });

    // ----------------------------------------------------

    socket.on("login", function() {
      var userData = {};
      userData.socketID = socket.id;
      userList.push(userData);

      console.log('# users: ' + userList.length);

      //var loginMessage = userData.id + ' has logged in';
      //socket.broadcast.emit("message", loginMessage);
      //io.emit("numUsers", userList.length);
      //io.emit('userlist', userList);
    });

    // ----------------------------------------------------
    socket.on("getUserList", function() {
      console.log('# users: ' + userList.length);
      //socket.emit('userlist', userList) ;
    });

    // ----------------------------------------------------
    socket.on("disconnect", function() {
      // remove user from userList array
      for(var i=0, len = userList.length; i<len; ++i ) {
        var user = userList[i];

        if(user.socketID === socket.id){
          //io.emit('message', user.name + ' has logged out');
          userList.splice(i,1);
          console.log('user logged out....');
          console.log('# users: ' + userList.length);
          break;
        }
      }
      //io.emit("userlist", userList);
    });

    socket.emit("message", "[connected to server]");

});

// utility functions
/*
function getUserNameArray() {
  var userNameArray = [];
  userList.forEach(function(element, index, array) {
      userNameArray.push(userList[index].name);
  });
  return userNameArray;
}
*/

function cleanData(data) {
    for(var i=0; i < data.length; i++) {

      data[i]._Common_Name = data[i].Common_Name; // save version with "_"
      data[i].Common_Name = data[i].Common_Name.replace("_", " ");
      data[i].Council_Name = data[i].Council_Name.replace("-", "");
      data[i]._Group = data[i].Group;
      data[i].Group = data[i].Group.replace(/_/g, ' ');
      if(data[i].Group === '-') {
          data[i].Group = '(No Group)';
      }
    }
}

console.log("Starting Multiverse Browser server on http://" + settings.MULTIVERSE_SERVER_IP + ":" + settings.MULTIVERSE_SERVER_PORT);

exports.mainApp = app;

}());
