var Backbone = require('backbone')

// Local Storage - Load the data in from a user file
require('backbone.localstorage')

var $ = window.$;

var PaperList = Backbone.Collection.extend({
  model: Paper,

  localStorage: new Backbone.LocalStorage("papers-backbone"),
  //localStorage: true,
  //url: 'http://rest.com/api/',
  //localStorage: new Store('papers-backbone'),
  //url: '/papers',

  nextOrder: function() {
    if(!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: 'order'
});

var Papers = new PaperList;
