"use strict";
// Backbone View: View Note

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var NoteView = Backbone.View.extend({
  template: _.template($('#note-view-template').html()),

  events: {
    "dblclick "       : "edit",
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

  edit: function() {
    // Now jump to note edit page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/notes/" + this.noteId + "/edit");
  },

});
