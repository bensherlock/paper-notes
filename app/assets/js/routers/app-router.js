// Backbone Router: AppRouter

// Includes
var Backbone = require('backbone')
var $ = window.$;

var viewPaperController = require('view-paper-controller');

var AppRouter = Backbone.Router.extend({

  routes : {
      'papers/:id' : viewPaperController
  }


});
