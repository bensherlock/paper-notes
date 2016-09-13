var remote = require('electron').remote;
var dialog = remote.dialog;
var fs = require('fs');

var Backbone = require('backbone');
var _ = require('underscore');
//var $ = require('jquery')
var $ = window.$;

// '#' = id, '.'=class

var AppView = Backbone.View.extend({

  el: $('#paperapp'),

  events: {
    'keypress #new-paper':  'createOnEnter',

    'click #files #clear' : 'fileclear',
    'click #files #open' : 'fileopen',
    'click #files #save' : 'filesave',
  },

  initialize: function() {
    //_.bindAll(this, 'render', 'addOne', 'addAll', 'createOnEnter', 'showAlert');

    //console.log('AppView::initialize DOMisReady=' + $.isReady);

    this.input = this.$('#new-paper');

    this.listenTo(Papers, 'add', this.addOne);
    this.listenTo(Papers, 'reset', this.addAll);
    this.listenTo(Papers, 'all', this.render);

    //this.footer = this.$('footer');
    this.main = this.$('#main');

    // Fetch from server/db
    Papers.fetch();

    // For demosntration/testing we'll clear the database
    // then add a single example.

    // Delete all existing first
    _.invoke(Papers.toArray(), 'destroy');

    // Insert a new paper into the papers (and sync)
    Papers.create( {title: 'A paper title', notes : [ { title: "A note", datetime: "2016-09-13T09:36:00Z", text: "A load of text about something of interest." } ]} );

  },

  render: function() {
    //console.log('AppView::render Papers.length=' + Papers.length);
    if (Papers.length) {
      this.main.show();
      //this.footer.show();
      //this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
    } else {
      this.main.hide();
      //this.footer.hide();
    }
  },

  addOne: function(paper) {
    //console.log('AppView::addOne paper=' + JSON.stringify(paper));
    var view = new PaperView({model: paper});
    this.$("#paper-list").append(view.render().el);
  },

  addAll: function() {
    this.$("#paper-list").empty();
    Papers.each(this.addOne, this);
  },

  createOnEnter: function(e) {
    //console.log('AppView::createOnEnter e=' + e.keyCode);
    if (e.keyCode != 13) return;
    if (!this.input.val()) return;

    Papers.create({title: this.input.val()});
    this.input.val('');
  },


  get_type: function(thing) {
    if(thing===null)return "[object Null]"; // special case
    //return Object.prototype.toString.call(thing);
    return thing.constructor.name;
  },

  showAlert : function() {
    alert('You clicked me');
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

       fs.writeFile(fileName, JSON.stringify(Papers.toJSON()), function (err) {
           if(err) {
               console.log("An error ocurred creating the file "+ err.message)
           }

           console.log("The file has been succesfully saved");
       });

     });

   }

});


$(document).ready(function(){
//$(function(){
  var appview = new AppView();
});
