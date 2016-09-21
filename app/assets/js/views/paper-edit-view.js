"use strict";
// Backbone View: Edit Paper

// Includes
var Backbone = require('backbone')
var _ = require('underscore')
var TokenField = require('tokenfield')
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

    this.$el.html(this.template(this.model.toJSON()));

    var tokens = [];
    var tags = this.model.get('tags');

    for( var i = 0; i < tags.length; i++ ) {
      tokens.push({
        id: i,
        name: tags[i]
      });
    }

    var possibleTokens = tokens.slice();
    possibleTokens.push( { id: possibleTokens.length, name: 'JASA' } );

    this.tagsField = new TokenField({
      el: this.$('#tags')[0],
      items: possibleTokens,
      setItems: tokens,
      newItems: false,
    });
  },

  render: function() {

    return this;
  },


  onSubmit : function(event) {
    event.preventDefault();
    this.saveAndClose();
  },

  saveAndClose : function() {

    console.log('tags=' + this.$('#tags').val());

    var tokens = this.tagsField.getItems();
    var tags = [];

    tokens.forEach(function(item) {
      tags.push(item.name);
    });

    // Get the Tokens back and convert to string tags
    console.log('items=' + this.tagsField.getItems());


    this.model.save( {
      key: this.$('#key').val(),
      title: this.$('#title').val(),
      year: this.$('#year').val(),
      authors: this.$('#authors').val(),
      overview: this.$('#overview').val(),
      tags: tags,
      //tags: this.$('#tags').val(),
    } );

    this.close();
  },

  close: function() {
    // Now jump to paper view page
    Backbone.trigger('approuter:go', "/papers/" + this.model.id);
  },

});
