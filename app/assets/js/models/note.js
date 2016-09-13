// Backbone Model: Note

// Includes
var Backbone = require('backbone')
var $ = window.$;


var Note = Backbone.Model.extend({

  defaults: function() {

      return {
        title: "",
        datetime: "2016-09-13T09:44:00Z",
        text: "",

        order: Notes.nextOrder()
      };
    },

    //urlRoot: '/notes',
});
