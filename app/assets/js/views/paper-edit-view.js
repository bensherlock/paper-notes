var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PaperEditView = Backbone.View.extend({
  template: _.template($('#paper-edit-template').html()),

  events: {
    "submit #paper-edit-form" : "onSubmit",
    "click .submit"  : "saveAndClose",
    "click .cancel"  : "close",
  },

  initialize: function() {
    //console.log('PaperEditView::initialize');
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


  onSubmit : function(event) {
    event.preventDefault();
    this.saveAndClose();
  },

  saveAndClose : function() {
    this.model.save( {
      key: this.$('#key').val(),
      title: this.$('#title').val(),
      year: this.$('#year').val(),
      authors: this.$('#authors').val(),
      overview: this.$('#overview').val(),
      tags: this.$('#tags').val(),
    } );

    this.close();
  },

  close: function() {
    // Now jump to paper view page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id);
  },

});
