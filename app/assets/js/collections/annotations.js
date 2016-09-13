// Collection: Annotations

// Includes:
var Backbone = require('backbone')

// Local Storage - Load the data in from a user file
require('backbone.localstorage')

var $ = window.$;

var AnnotationList = Backbone.Collection.extend({
  model: Annotation,

  localStorage: new Backbone.LocalStorage("annotations-backbone"),
  //localStorage: true,
  //url: 'http://rest.com/api/',
  //localStorage: new Store('papers-backbone'),
  //url: '/papers',


  initialize: function(models, options) {
    this.paper = options.paper;
  },


  nextOrder: function() {
    if(!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: 'order'
});

//var Annotations = new AnnotationList;
