"use strict";
// Backbone View: View Paper

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
var TokenField = require('tokenfield')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PaperView = Backbone.View.extend({
  template: _.template($('#paper-view-template').html()),

  events: {
    "dblclick "       : "edit",

    'submit #note-create-form' : 'onSubmit',
  },

  initialize: function() {
    //console.log('PaperView::initialize');
    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'all', this.render);

    // tags
    //this.tagsField = new TokenField({ el: '#tags'});
  },

  render: function() {
    if(this.model) {
      this.$el.html(this.template(this.model.toJSON()));
      

      var modelJson = this.model.toJSON();

      console.log('modelJson.notes=' + modelJson.notes);
      //console.log(this.logTag + '::' + 'render this.model.notes.length=' + this.model.notes.length);
      if (modelJson.notes && modelJson.notes.length) {
        this.$('#main').show();
        // Add all
        this.addAll();
      } else {
        this.$('#main').hide();
      }
    }
    return this;
  },

  addOne: function(noteId) {
    //console.log(this.logTag + '::' + 'addOne paper=' + JSON.stringify(paper));
    console.log('noteId=' + noteId);
    var view = new NotesItemView({model: this.model, noteId: noteId});
    this.$("#note-list").append(view.render().el);
  },

  addAll: function() {
    //console.log(this.logTag + '::' + 'addAll');
    this.$("#note-list").empty();

    //this.model.notes.each(this.addOne, this);
    for(var noteId = 0, len = this.model.toJSON().notes.length; noteId < len; noteId++ ) {
      this.addOne( noteId );
    }
  },

  edit: function() {
    // Now jump to paper edit page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/edit");
  },


  createOnEnter: function(e) {
    //console.log(this.logTag + '::' + 'createOnEnter e=' + e.keyCode);
    if (e.keyCode != 13) return;
    if (!this.$('#note-title').val()) return;

    var notes = this.model.get('notes');
    notes.push( {title: this.$('#note-title').val(), datetime: new Date().toISOString(), text: ""} );
    notes = _.clone(notes);
    var noteId = notes.length - 1;
    this.model.set('notes', notes);
    this.model.save();

    // Now jump to edit page
    Backbone.trigger('approuter:go', '/papers/' + this.model.id + '/notes/' + noteId + '/edit');
  },

  onSubmit : function(event) {
    event.preventDefault();

    if (!this.$('#note-title').val()) return;

    var notes = this.model.get('notes');
    notes.push( {title: this.$('#note-title').val(), datetime: new Date().toISOString(), text: ""} );
    notes = _.clone(notes);
    var noteId = notes.length - 1;
    this.model.set('notes', notes);
    this.model.save();

    // Now jump to edit page
    Backbone.trigger('approuter:go', '/papers/' + this.model.id + '/notes/' + noteId + '/edit');
  },


});
