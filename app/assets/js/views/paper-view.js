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

      console.log(this.logTag + '::' + 'render this.model.notes.length=' + this.model.notes.length);
      if (this.model.notes.length) {
        this.$('#main').show();

          // Add all
          this.addAll();

        } else {
          this.$('#main').hide();
        }

      return this;

    }
    return this;
  },

  addOne: function(note) {
    //console.log(this.logTag + '::' + 'addOne paper=' + JSON.stringify(paper));
    var view = new NotesItemView({model: note});
    this.$("#note-list").append(view.render().el);
  },

  addAll: function() {
    //console.log(this.logTag + '::' + 'addAll');
    this.$("#note-list").empty();
    this.model.notes.each(this.addOne, this);
  },

  edit: function() {
    // Now jump to paper edit page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/edit");
  },

  clear: function() {
    this.model.destroy();
  },

});
