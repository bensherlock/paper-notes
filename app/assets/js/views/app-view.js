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

    // Delete all existing first
    _.invoke(Papers.toArray(), 'destroy');

    // Reset papers to empty
    Papers.reset();
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

          // Now reset
          // reset with the new data
          Papers.reset(jsonThing);
    });
  },

  filesave : function() {
    console.log('AppView::filesave');

    dialog.showSaveDialog(function (fileName) {
       if (fileName === undefined){
            console.log("You didn't save the file");
            return;
       }

       // Grab the Papers as JSON text.
       // fileName is a string that contains the path and filename created in the save file dialog.

       fs.writeFile(fileName, JSON.stringify(Papers), function (err) {
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
