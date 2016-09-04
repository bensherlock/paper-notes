var Backbone = require('backbone')
require('backbone.localstorage')


var PaperList = Backbone.Collection.extend({
  model: Paper,

  localStorage: new Backbone.LocalStorage("papers-backbone"),
  //localStorage: true,
  //url: 'http://rest.com/api/',
  //localStorage: new Store('papers-backbone'),

  nextOrder: function() {
    if(!this.length) return 1;
    return this.last().get('order') + 1;
  },

  comparator: 'order'
});

var Papers = new PaperList;
