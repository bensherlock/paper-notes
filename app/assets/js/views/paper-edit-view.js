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
        id: tags[i],//.toLowerCase(),
        name: tags[i]
      });
    }

    // Create Possible Tokens for Tokenfield
    //var possibleTagTokens = tagTokens.slice(); // For now just a clone of the set tokens
    var possibleTags = this.model.collection.getAllTags();
    var possibleTagTokens = [];
    for( var i = 0; i < possibleTags.length; i++ ) {
      possibleTagTokens.push({
        id: possibleTags[i],//.toLowerCase(),
        name: possibleTags[i]
      });
    }

    // Create the Tokenfield
    this.tagsField = new TokenField({
      el: this.$('#tags')[0],
      items: possibleTagTokens,
      newItems: true,
      setItems: tagTokens,
    });


    // Paper Tags (array of strings)
    var authors = this.model.get('authors');

    // Create Set Tokens for Tokenfield
    var authorTokens = [];
    for( var i = 0; i < authors.length; i++ ) {
      authorTokens.push({
        id: authors[i],//.toLowerCase(),
        name: authors[i]
      });
    }

    // Create Possible Tokens for Tokenfield
    //var possibleAuthorTokens = authorTokens.slice(); // For now just a clone of the set tokens
    // In future this could be:
    var possibleAuthors = this.model.collection.getAllAuthors();
    var possibleAuthorTokens = [];
    for( var i = 0; i < possibleAuthors.length; i++ ) {
      possibleAuthorTokens.push({
        id: possibleAuthors[i],//.toLowerCase(),
        name: possibleAuthors[i]
      });
    }

    // Create the Tokenfield
    this.authorsField = new TokenField({
      el: this.$('#authors')[0],
      items: possibleAuthorTokens,
      newItems: true,
      setItems: authorTokens,
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


    // Get the Set Tokens from Tokenfield
    var authorTokens = this.authorsField.getItems();

    // Create the array of tag strings
    var authors = [];
    authorTokens.forEach(function(item) {
      authors.push(item.name);
    });

    // Save the Paper Contents
    this.model.save( {
      key: this.$('#key').val(),
      title: this.$('#title').val(),
      year: this.$('#year').val(),
      authors: authors,
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
