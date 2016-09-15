// Controller: ViewPapersController

// Includes
//var Backbone = require('backbone')
var $ = window.$;

// Container where the view will be rendered.
var $container = $('#app-view-container');

var viewPapersController = function() {
  console.log('viewPapersController');
  // Fetch all Papers in the database.
  // Display the Summary of Each

  var view = new PapersView();

  $container.empty().append( view.render().el );
  //Papers.fetch();
}
