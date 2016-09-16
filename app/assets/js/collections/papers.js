var Backbone = require('backbone')

// Local Storage - Load the data in from a user file
require('backbone.localstorage')

var $ = window.$;

//Backbone.Collection.prototype.save = function (options) {
//  Backbone.sync("create", this, options);
//};

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

/*
  save: function( options ) {
    var self = this;

    var success = options.success;
    var error = options.error;
    var complete = options.complete;

    options.success = function( response, status, xhr ) {
      self.trigger('sync', self, response, options);
      if (success) return success.apply(this, arguments);
    };

    options.error = function( response, status, xhr ) {
      self.trigger('error', self, response, options);
      if (error) return error.apply(this, arguments);
    };

    options.complete = function( response, status, xhr ) {
      if (complete) return complete.apply(this, arguments);
    }

    Backbone.sync('create', this, options);
  },
  */

  comparator: 'order'
});


var Papers = new PaperList;

// Force the collection to save to server when changes are made locally.
//Papers.bind('change add remove reset', function(){
//    this.save({});
//});
