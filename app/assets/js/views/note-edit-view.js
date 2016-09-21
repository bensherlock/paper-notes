"use strict";
// Backbone View: Edit Note

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var NoteEditView = Backbone.View.extend({
  template: _.template($('#note-edit-template').html()),

  events: {
    "submit #paper-edit-form" : "onSubmit",
    "click .submit"  : "saveAndClose",
    "click .cancel"  : "close",
  },

  initialize: function(options) {
    this.noteId = options.noteId;

    //console.log('PaperEditView::initialize');
    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    if(this.model) {
      var modelJson = this.model.toJSON();
      this.$el.html(this.template( modelJson.notes[this.noteId]));
    }

    return this;
  },


  onSubmit : function(event) {
    event.preventDefault();
    this.saveAndClose();
  },

  saveAndClose : function() {
    var notes = this.model.get( 'notes' );

    notes[this.noteId].title = this.$('#title').val();
    notes[this.noteId].text = this.$('#text').val();

    this.model.set('notes', notes);
    this.model.trigger("change");
    this.model.trigger("change:notes");

    this.model.save();

    this.close();
  },

  close: function() {
    // Now jump to note view page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/notes/" + this.noteId );
  },

});
