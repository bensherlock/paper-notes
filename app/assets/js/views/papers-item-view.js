var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PapersItemView = Backbone.View.extend({
  template: _.template($('#papers-item-view-template').html()),

  events: {
    'click .title'  : 'clickTitle',
    'click .destroy' : 'clear',
  },

  initialize: function() {
    //console.log('PaperView::initialize');
    this.listenTo(this.model, 'reset', this.render);
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    //console.log('render:: this.model=' + this.model);

    if(this.model) {
      this.$el.html(this.template(this.model.toJSON()));
      //this.$el.html(this.template(this.model));
    }

    return this;
  },

  clickTitle: function() {
    console.log('clickTitle');
    Backbone.trigger('approuter:go', "/papers/" + this.model.id);
  },

  clear: function() {
    this.model.destroy();
  }
});
