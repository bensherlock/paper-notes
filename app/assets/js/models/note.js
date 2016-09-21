"use strict";
// POJO Model: Note

// Includes
//var Backbone = require('backbone')
var _ = require('underscore')
var $ = window.$;


var Note = function(options) {
  options || (options = {});
};

_.extend(Note.prototype, {


  defaults: function() {

      return {
        title: "",
        datetime: new Date().toISOString(), //"2016-09-13T09:44:00Z",
        text: "",

        //order: Notes.nextOrder()
      };
    },

    urlRoot: '/papers/:id/notes',
});
