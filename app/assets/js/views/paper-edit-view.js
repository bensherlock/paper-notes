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

    // Paper Tags (array of strings)
    var tags = this.model.get('tags');

    // Create Set Tokens for Tokenfield
    var tagTokens = [];
    for( var i = 0; i < tags.length; i++ ) {
      tagTokens.push({
        id: tags[i].toLowerCase(),
        name: tags[i]
      });
    }

    // Create Possible Tokens for Tokenfield
    var possibleTokens = tagTokens.slice(); // For now just a clone of the set tokens
    // In future this could be:
    //  a) All Tags within a Paper and its Notes;
    //  b) All Tags within All Papers and their Notes;
    //  c) All Tags within a seperate Collection.


    // Create the Tokenfield
    this.tagsField = new TokenField({
      el: this.$('#tags')[0],
      items: possibleTokens,
      newItems: true,
      setItems: tagTokens,
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
    // Get the Set Tokens from Tokenfield
    var tagTokens = this.tagsField.getItems();

    // Create the array of tag strings
    var tags = [];
    tagTokens.forEach(function(item) {
      tags.push(item.name);
    });

    // Save the Paper Contents
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
