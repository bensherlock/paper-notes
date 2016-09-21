// Controller: ViewAppController

// Includes
//var Backbone = require('backbone')
var $ = window.$;

// Container where the view will be rendered.
var $container = $('#app-view-container');

var viewAppController = function() {
  console.log('viewAppController');

  var view = new AppView();

  $container.empty().append( view.render().el );
}
