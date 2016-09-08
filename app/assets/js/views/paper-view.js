var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PaperView = Backbone.View.extend({
  tagName: "li",

  template: _.template($('#item-template').html()),

  events: {
      //"click .toggle"   : "toggleDone",
      "dblclick .view"  : "edit",
      "click .destroy" : "clear",
      "keypress .edit"  : "updateOnEnter",
      "blur .edit"      : "close"
    },

    initialize: function() {
      console.log('PaperView::initialize');
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      console.log('PaperView::render model=' + JSON.stringify(this.model));
      console.log('Template=' + this.template(this.model.toJSON()));
      console.log('el=' + this.el.tagName);
      //alert(this.el + ' ');
      this.$el.html(this.template(this.model.toJSON()));
      //this.$el.html(this.template(this.model.attributes));
      //this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');

      return this;
    },

    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },

    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },

    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    clear: function() {
      this.model.destroy();
    }
});
