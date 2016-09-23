"use strict";
// Backbone View: View Anchor Item

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var AnchorsItemView = Backbone.View.extend({
  template: _.template($('#anchors-item-view-template').html()),

  events: {
    'click  .edit'              : 'edit',
    'click .destroy'            : 'clear',

    'submit #anchor-edit-form'  : 'onSubmit',
    'click .cancel'             : 'onCancel',
  },

  initialize: function(options) {
    this.noteId = options.noteId;
    this.anchorId = options.anchorId;

    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);

    this.listenTo(this.model, 'destroy', this.remove);

    this.isEditing = false;
  },

  render: function() {
    //console.log('render:: this.model=' + this.model);
    if(this.model) {
      var notes = this.model.get('notes');
      this.$el.html(this.template( notes[this.noteId].anchors[this.anchorId] ));

      // Viewing vs Editing
      if( this.isEditing ) {
        this.$('.viewing').hide();
        this.$('.editing').show();
      } else {
        this.$('.viewing').show();
        this.$('.editing').hide();
      }
    }

    return this;
  },

  edit: function() {
    this.isEditing = true;
    this.render();
  },


  onSubmit: function(event) {
    event.preventDefault();

    // Save changes
    var notes = this.model.get('notes');
    notes = _.clone(notes);

    notes[this.noteId].anchors[this.anchorId].page =  this.$('#page').val();
    notes[this.noteId].anchors[this.anchorId].thing = this.$('#thing').val();
    notes[this.noteId].anchors[this.anchorId].text =  this.$('#text').val();

    this.model.set('notes', notes);
    this.model.trigger("change");
    this.model.trigger("change:notes");

    this.model.save();


    this.isEditing = false;
    this.render();
  },

  onCancel: function() {
    // Discard changes
    this.isEditing = false;
    this.render();
  },


  clear: function() {
    // Delete the anchorId
    var notes = this.model.get('notes');
    notes[this.noteId].anchors.splice( this.anchorId, 1 );
    notes = _.clone(notes);
    this.model.set('notes', notes ); //notes.slice()); // - shallow copy

    this.model.save();

    // Remove this view now
    this.remove();
  }
});
