var Backbone = require('backbone')

var Paper = Backbone.Model.extend({
  defaults: function() {
      return {
        key: "",
        order: Papers.nextOrder(),
        title: ""
      };
    },
});
