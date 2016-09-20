var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PaperView = Backbone.View.extend({
  template: _.template($('#paper-view-template').html()),

  events: {
    "dblclick "       : "edit",
    "click .destroy"  : "clear",
  },

  initialize: function() {
    //console.log('PaperView::initialize');
    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
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

  clear: function() {
    this.model.destroy();
  },

});
