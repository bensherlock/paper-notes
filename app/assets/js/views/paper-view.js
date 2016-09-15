var Backbone = require('backbone')
var _ = require('underscore')
//var $ = require('jquery')
var $ = window.$;

//'#' = id, '.'=class

var PaperView = Backbone.View.extend({
  template: _.template($('#paper-view-template').html()),

  events: {
    //"click .toggle"   : "toggleDone",
    "dblclick "  : "edit",
    "click .destroy" : "clear",

    "submit #paper-edit-form" : "onSubmit",
    "click .submit"  : "saveAndClose",
    "click .cancel"  : "close",


    //"keypress .edit"  : "updateOnEnter",
    //"blur     .edit"  : "close",
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
    }

    return this;
  },

  edit: function() {
    // Change template to be paper-edit-template
    this.template = _.template($('#paper-edit-template').html());

    this.render();
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
    // Change template to be paper-view-template
    this.template = _.template($('#paper-view-template').html());

    this.render();

    // Or change url?
  },


  updateOnEnter: function(e) {
    if (e.keyCode == 13) this.close();
  },

  clear: function() {
    this.model.destroy();
  },

});
