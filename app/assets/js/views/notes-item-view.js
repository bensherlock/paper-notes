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
    'click .view'  : 'goToView',
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
      var notes = this.model.get('notes');
      this.$el.html(this.template( notes[this.noteId] ));
    }

    return this;
  },

  goToView: function() {
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
