// ---------------------------------------------------
// Module to handle communication to MongoDB database
//
// db name: 'multiverse'
// collection name: 'galaxies2'
//
// ---------------------------------------------------
"use strict";

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/multiverse';

var connectedDB = null;

// ---------------------------------------------------
// Connect to database
// ---------------------------------------------------
MongoClient.connect(url, function(err, db) {
  connectedDB = db;
  assert.equal(null, err);
  console.log("Connected correctly to database.");
});

exports.findGalaxies = function(groupSelect, typeSelect, callback) {
   console.log('find galaxies for group: ' + groupSelect +' and type: ' + typeSelect);
   var findParam = {};
   if(groupSelect !== undefined && groupSelect !== '') {
       findParam["Group"] = groupSelect;
   }
   if(typeSelect !== undefined && typeSelect !== '') {
       findParam["Type_Text"] = typeSelect;
   }
   var cursor = connectedDB.collection('galaxies2').find( findParam );
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

exports.findGalaxyGroups = function(callback) {
  connectedDB.collection('galaxies2').distinct('Group', function(err, doc) {
    assert.equal(err, null);
    if (doc !== null) {
      doc.splice(doc.indexOf('-'), 1);
      console.log('end of db read: groups');
      callback(doc);
    }
  });
};

exports.findGalaxyTypes = function(callback) {
  connectedDB.collection('galaxies2').distinct('Type_Text', function(err, doc) {
    assert.equal(err, null);
    if (doc !== null) {
      console.log('end of db read: types');
      callback(doc);
    }
  });
};

exports.findGalaxyDetails = function(searchData, callback) {
   console.log('searching for... ' + searchData);
   var cursor = connectedDB.collection('galaxies2').find( {"Common_Name":searchData} );
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
