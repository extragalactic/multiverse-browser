// ==========================================================
// galaxy-server.js
// ==========================================================

(function() {

// npm modules
var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app).listen(3100);
var io = require("socket.io")(server);
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/multiverse';

var osc = require('node-osc');

var oscServer, oscClient;

// custom modules or data structures
var users = require('./public/js/galaxyInfo');

// init vars
var userList = [];

var connectedDB = null;

// connect to db
MongoClient.connect(url, function(err, db) {
  connectedDB = db;
  assert.equal(null, err);
  console.log("Connected correctly to database.");
});

app.use(express.static("./public"));

io.on("connection", function(socket) {

   // ----------------------------------------------------
   socket.on("config", function (obj) {

      console.log('configure OSC socket');
      oscServer = new osc.Server(obj.server.port, obj.server.host);
      oscClient = new osc.Client(obj.client.host, obj.client.port);

    //  oscClient.send('/status', socket.sessionId + ' connected');

      oscServer.on('message', function(msg, rinfo) {
        var OSCmsg = msg[2][0];
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

        findGalaxies(connectedDB, groupSelect, typeSelect, function(data) {
          cleanData(data);
          socket.emit('galaxyList', data);
        });
      });

    // ----------------------------------------------------
    socket.on("galaxyGroupsRequest", function() {
      console.log('find galaxy groups');
      findGalaxyGroups(connectedDB, function(data) {
          console.log('emiting galaxy groups');
          socket.emit('galaxyGroups', data);
      });
    });

    // ----------------------------------------------------
    socket.on("galaxyTypeRequest", function() {
      console.log('find galaxy types');
      findGalaxyTypes(connectedDB, function(data) {
          console.log('emiting galaxy types');
          socket.emit('galaxyTypes', data);
      });
    });

    // ----------------------------------------------------
    socket.on("galaxyDetailsRequest", function(searchData) {

      findGalaxyDetails(connectedDB, searchData, function(data) {
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

// database operations

var findGalaxies = function(db, groupSelect, typeSelect, callback) {
   console.log('find galaxies for group: ' + groupSelect);
   var findParam = {};
   if(groupSelect !== undefined && groupSelect !== '') {
       findParam["Group"] = groupSelect;
   }
   if(typeSelect !== undefined && typeSelect !== '') {
       findParam["Type_Text"] = typeSelect;
   }
   var cursor = db.collection('galaxies2').find( findParam );
   var returnData = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
         returnData.push(doc);
      } else {
         console.log('end of db read: list');
         callback(returnData);
      }
   });
};

var findGalaxyGroups = function(db, callback) {
  db.collection('galaxies2').distinct('Group', function(err, doc) {
    assert.equal(err, null);
    if (doc !== null) {
      doc.splice(doc.indexOf('-'), 1);
      console.log('end of db read: groups');
      callback(doc);
    }
  });
};


var findGalaxyTypes = function(db, callback) {
  db.collection('galaxies2').distinct('Type_Text', function(err, doc) {
    assert.equal(err, null);
    if (doc !== null) {
      console.log('end of db read: types');
      callback(doc);
    }
  });
};


var findGalaxyDetails = function(db, searchData, callback) {
   console.log('searching for... ' + searchData);
   var cursor = db.collection('galaxies2').find( {"Common_Name":searchData} );
   var returnData = [];
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc !== null) {
         returnData.push(doc);
      } else {
         console.log('end of db read: details');
         callback(returnData);
      }
   });
};

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
          data[i].Group = '(Field Galaxy)';
      }
    }
}

console.log("Starting Sigma-1 Socket App on http://localhost:3100");

exports.mainApp = app;


}());
