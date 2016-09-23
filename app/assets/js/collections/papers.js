"use strict";
// Backbone Collection: Papers

var Backbone = require('backbone')

// Local Storage - Load the data in from a user file
require('backbone.localstorage')

var $ = window.$;


var PaperList = Backbone.Collection.extend({
  model: Paper,

  //localStorage: new Backbone.LocalStorage("papers-backbone"),
  //localStorage: true,
  //url: 'http://rest.com/api/',
  //localStorage: new Store('papers-backbone'),
  url: '/papers',


  nextOrder: function() {
    if(!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: 'order',


  // Get all Tags in all Papers in this collection
  getAllTags: function() {
    var allTags = [];
    // Use Pluck

    // array of string arrays
    var allTagsArr = this.pluck('tags');
    if( allTagsArr.length ) {
      allTags = [].concat.apply([], allTagsArr);
    }

    return allTags;
  },


  // Get all Authors in all Papers in this collection
  getAllAuthors: function() {
    var allAuthors = []
    // Use Pluck

    // array of string arrays
    var allAuthorsArr = this.pluck('authors');
    if( allAuthorsArr.length ) {
      allAuthors = [].concat.apply([], allAuthorsArr);
    }

    return allAuthors;
  },

});

var Papers = new PaperList;
