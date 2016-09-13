// Backbone Model: Annotation

// Includes
var Backbone = require('backbone')
var $ = window.$;


var Annotation = Backbone.Model.extend({
  
  defaults: function() {
      return {
        datetime: "2016-09-13T09:42:00Z",
        pageNumber: 0,
        anchor: { type: "textAnchor", selectedText: "" },
        text: "",

        order: Annotations.nextOrder()
      };
    },

    //urlRoot: '/annotations',
});
