"use strict";
// Backbone Model: Note

// Includes
var Backbone = require('backbone')
var $ = window.$;


var Note = Backbone.Model.extend({

  // Set the idAttribute (Backbone Model) to use the LokiJS controlled attribute.
  // i.e. id: return $loki,
  idAttribute: dbIdAttribute,

  defaults: function() {

      return {
        title: "",
        datetime: "2016-09-13T09:44:00Z",
        text: "",

        //order: Notes.nextOrder()
      };
    },

    urlRoot: '/papers/:id/notes',
});
