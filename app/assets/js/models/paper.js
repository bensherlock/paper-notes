var Backbone = require('backbone')

var $ = window.$;

var Paper = Backbone.Model.extend({
  defaults: function() {
      return {
        key: "",
        order: Papers.nextOrder(),
        title: ""
      };
    },

    //urlRoot: '/api/pages',
    //localStorage: true
});
