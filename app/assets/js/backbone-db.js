"use strict"
// Backbone DB Setup

// Includes
var Backbone = require('backbone')

// LokiJS - Data is held in filebased db - uses sync override.
var Loki = require('lokijs')

window.dbIsLoaded = false;

var LokiDB = new Loki('lokidb.json', {persistenceMethod:'fs', autosave: true, autoload: true,
  autoloadCallback: function() {
    // Check if we have a database already, otherwise create the collections.
    var papers = LokiDB.getCollection('papers');
    if( !papers ) {
      LokiDB.addCollection('papers');
    }
    console.log('db is loaded');
    window.dbIsLoaded = true;
  }
});

// LokiJS
var dbIdAttribute = "$loki";




//var diskdb = require('diskdb')
//diskdb = diskdb.connect('diskdb.json', ['papers'])


// DiskDB
//var dbIdAttribute: "_id",


var getKeys = function(obj){
   var keys = [];
   for(var key in obj){
      keys.push(key);
   }
   return keys;
}


// Override the global Backbone.sync
Backbone.sync = function(method, model, options) {

  console.log("Backbone::sync method=" + method + " model=" + model);

  var lokiCollection = LokiDB.getCollection('papers'); // Can use the URL here later

  var resp, errorMessage;
  try {

    switch (method) {
      case "read":
        resp = model.id != undefined ? lokiCollection.find(model.toJSON()) : lokiCollection.find();
        //resp = model.id != undefined ? diskdb.papers.find(model) : diskdb.papers.find();
        break;
      case "create":
        resp = lokiCollection.insertOne(model.toJSON());
        //resp = diskdb.papers.insertOne(model);

        break;
      case "update":
        var jsonStr = JSON.stringify(model);
        console.log('jsonStr=' + jsonStr);
        resp = lokiCollection.update(model.toJSON());
        //resp = diskdb.papers.update(model);

        break;
      case "delete":
        resp = lokiCollection.remove(model.toJSON());
        //resp = diskdb.papers.destroy(model);

        break;
    }

  } catch(error) {
      errorMessage = error.message;

      console.log('errorMessage=' + errorMessage);
  }

/*
  try {
    LokiDB.save();
  } catch(error) {
    errorMessage = error;
    console.log('LokiDB.save() :: errorMessage=' + errorMessage);
  }
*/


  console.log('resp=' + resp);
  if (resp) {
    console.log('resp.keys=' + getKeys(resp));

    if (options && options.success) {
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, resp, options);
      } else {
        options.success(resp);
      }
    }
  } else {
    errorMessage = errorMessage ? errorMessage
                                : "Record Not Found";

    if (options && options.error)
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, errorMessage, options);
      } else {
        options.error(errorMessage);
      }
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

};
