var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PapersView = Backbone.View.extend({
  logTag: 'PapersView',

  template: _.template($('#papers-view-template').html()),

  events: {
    //'keypress #paper-create-form':  'createOnEnter',
    'submit #paper-create-form' : 'onSubmit',

    'click #files #clear' : 'fileclear',
    'click #files #open' : 'fileopen',
    'click #files #save' : 'filesave',
  },

  initialize: function() {
    console.log(this.logTag + '::' + 'initialize');

    this.$el.html(this.template);

    //_.bindAll(this, 'render', 'addOne', 'addAll', 'createOnEnter', 'showAlert');

    //console.log('AppView::initialize DOMisReady=' + $.isReady);


    this.listenTo(Papers, 'add', this.addOne);
    this.listenTo(Papers, 'reset', this.addAll);
    this.listenTo(Papers, 'all', this.render);


    // Fetch from server/db - and reset to force a render
    //console.log(this.logTag + '::' + 'fetching(reset=false)...');
    Papers.fetch();
    //console.log(this.logTag + '::' + 'fetched');

    // For demosntration/testing we'll clear the database
    // then add a single example.

    // Delete all existing first
    _.invoke(Papers.toArray(), 'destroy');

    // Insert a new paper into the papers (and sync)
    var p = Papers.create( {title: 'A paper title', key: "smith2016about", year: 2016, authors: ["Smith, A.N."] } );

    //p.notes.create( { title: "A note", datetime: "2016-09-13T09:36:00Z", text: "A load of text about something of interest." } );
    p.notes.add({ title: "A note", datetime: "2016-09-13T09:36:00Z", text: "A load of text about something of interest." } );
    p.save();
  },

  render: function() {
    //console.log(this.logTag + '::' + 'render Papers.length=' + Papers.length);
    if (Papers.length) {
      this.$('#main').show();

      // Add all
      this.addAll();

    } else {
      this.$('#main').hide();
    }

    return this;
  },

  addOne: function(paper) {
    //console.log(this.logTag + '::' + 'addOne paper=' + JSON.stringify(paper));
    var view = new PapersItemView({model: paper});
    this.$("#paper-list").append(view.render().el);
  },

  addAll: function() {
    //console.log(this.logTag + '::' + 'addAll');
    this.$("#paper-list").empty();
    Papers.each(this.addOne, this);
  },

  createOnEnter: function(e) {
    //console.log(this.logTag + '::' + 'createOnEnter e=' + e.keyCode);
    if (e.keyCode != 13) return;
    if (!this.$('#key').val()) return;

    var paper = Papers.create({key: this.$('#key').val()});
    //this.input.val('');
    // Now jump to edit page
    Backbone.trigger('approuter:go', "/papers/" + paper.id + "/edit");
  },

  onSubmit : function(event) {
    event.preventDefault();

    var paper = Papers.create({key: this.$('#key').val()});
    // Now jump to edit page
    Backbone.trigger('approuter:go', "/papers/" + paper.id + "/edit");
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
    console.log(this.logTag + '::' + 'fileclear');

    // Delete all existing first
    _.invoke(Papers.toArray(), 'destroy');

    // Reset papers to empty
    Papers.reset();
  },

  fileopen : function() {
    console.log(this.logTag + '::' + 'fileopen');
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
    console.log(this.logTag + '::' + 'filesave');

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
