"use strict";
// Backbone View: View App

// Includes
var remote = require('electron').remote;
var dialog = remote.dialog;
var fs = require('fs');

var Backbone = require('backbone');
var _ = require('underscore');
//var $ = require('jquery')
var $ = window.$;

// '#' = id, '.'=class

var AppView = Backbone.View.extend({

  template: _.template($('#app-view-template').html()),

  events: {
    'click #files #clear' : 'fileclear',
    'click #files #open' : 'fileopen',
    'click #files #save' : 'filesave',
  },

  initialize: function() {
    this.$el.html(this.template);
  },

  render: function() {
    //console.log('AppView::render');

    return this;
  },


  // File Operations
  fileclear : function() {
    console.log('AppView::fileclear');

    Papers.fetch({ complete: function() {
      // Delete all existing first
      _.invoke(Papers.toArray(), 'destroy');

      // Reset papers to empty - no need
      //Papers.reset([]);
    }});

  },

  fileopen : function() {
    console.log('AppView::fileopen');
    var self = this;

    dialog.showOpenDialog(function (fileNames) {
        // fileNames is an array that contains all the selected
       if(fileNames === undefined) {
            console.log("No file selected");
       } else {
            self.readFile(fileNames[0]);
       }
     });
  },

  readFile : function(filepath) {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if(err) {
            console.log("An error ocurred reading the file :" + err.message);
            return;
        }
        // Change how to handle the file content
        //console.log("The file content is : " + data);

        var jsonThing = JSON.parse(data); // throws exception if problem

        // Remove and lingering Loki meta data
        for(var i = 0; i < jsonThing.length; i++ ) {
          delete jsonThing[i].meta;
          delete jsonThing[i].$loki;
          delete jsonThing[i].order;
        }

        // Fetch update
        Papers.fetch({ complete: function() {
          // Delete all existing first
          _.invoke(Papers.toArray(), 'destroy');

          for(var i = 0; i < jsonThing.length; i++ ) {
            Papers.create( jsonThing[i] );
          }
        }});
    });
  },

  filesave : function() {
    console.log('AppView::filesave');

    dialog.showSaveDialog(function (fileName) {
       if (fileName === undefined){
            console.log("You didn't save the file");
            return;
       }
      // fileName is a string that contains the path and filename created in the save file dialog.

       // Grab the Papers as JSON text.
       var jsonObject = Papers.toJSON();

       // Remove the Loki meta data
       for(var i = 0; i < jsonObject.length; i++ ) {
         delete jsonObject[i].meta;
         delete jsonObject[i].$loki;
         delete jsonObject[i].order;
       }

       // Write the file as pretty-print JSON
       fs.writeFile(fileName, JSON.stringify(jsonObject, null, 2), function (err) {
           if(err) {
               console.log("An error ocurred creating the file "+ err.message)
           }

           console.log("The file has been succesfully saved");
       });

     });

   }

});


//$(document).ready(function(){
//$(function(){
//  var appview = new AppView();
//});
