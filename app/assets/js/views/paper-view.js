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
    }
    return this;
  },

  edit: function() {
    // Now jump to paper edit page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id + "/edit");
  },

  clear: function() {
    this.model.destroy();
  },

});
