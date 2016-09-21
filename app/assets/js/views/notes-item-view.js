"use strict";
// Backbone View: View Note Item

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var NotesItemView = Backbone.View.extend({
  template: _.template($('#notes-item-view-template').html()),

  events: {
    'click .title'  : 'clickTitle',
    'click .destroy' : 'clear',
  },

  initialize: function(options) {
    this.noteId = options.noteId;

    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    //console.log('render:: this.model=' + this.model);

    if(this.model) {
      var modelJson = this.model.toJSON();
      //console.log('modelJson=' + JSON.stringify(modelJson));
      //console.log('this.noteId=' + this.noteId);
      //console.log('modelJson.notes[this.noteId]=' + JSON.stringify(modelJson.notes[this.noteId]));
      this.$el.html(this.template( modelJson.notes[this.noteId]));
    }

    return this;
  },

  clickTitle: function() {
    console.log('clickTitle');
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/notes/" + this.noteId);
  },

  clear: function() {
    //this.model.destroy();
    // Delete the noteId
    var notes = this.model.get('notes');
    notes.splice( this.noteId, 1 );
    notes = _.clone(notes);
    this.model.set('notes', notes ); //notes.slice()); // - shallow copy

    this.model.save();

    // Remove this view now
    this.remove();
  }
});
