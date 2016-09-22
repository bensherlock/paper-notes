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
    "dblclick  .note"       : "edit",
    "click #paper"    : "toPaper",

    'submit #anchor-create-form' : 'onSubmit',
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
      this.$el.html(this.template( notes[this.noteId]));

      this.$('anchor-list').empty();

      if( notes[this.noteId].anchors && notes[this.noteId].anchors.length ) {
        this.$('#main').show();

        for(var i = 0; i < notes[this.noteId].anchors.length; i++ ) {
          var view = new AnchorsItemView({model: this.model, noteId: this.noteId, anchorId: i});
          this.$('#anchor-list').append(view.render().el);
        }
      } else {
        this.$('#main').hide();
      }

    }

    return this;
  },

  edit: function() {
    // Now jump to note edit page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/notes/" + this.noteId + "/edit");
  },

  toPaper: function() {
    // Now jump to paper view page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id);
  },

  onSubmit: function(event) {
    event.preventDefault();

    // Save Anchor
    var notes = this.model.get('notes');
    notes = _.clone(notes);

    if( !notes[this.noteId].anchors ) {
      notes[this.noteId].anchors = [];
    }

    notes[this.noteId].anchors.push({
      page:  this.$('#page').val(),
      thing: this.$('#thing').val(),
      text:  this.$('#text').val()
    });

    this.model.set('notes', notes);
    this.model.trigger("change");
    this.model.trigger("change:notes");

    this.model.save();

    this.render();
  },

});
