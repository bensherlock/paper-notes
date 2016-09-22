// Controller: ViewPapersController

// Includes
//var Backbone = require('backbone')
var $ = window.$;

// Container where the view will be rendered.
var $container = $('#app-view-container');

var viewPapersController = function(query) {
  console.log('viewPapersController::query=' + query);




  // Fetch all Papers in the database.
  // Display the Summary of Each
  //Papers.fetch({ data: {filter='abc'} });
  //var view = new PapersView({collection: Papers});

  var view = new PapersView();

  $container.empty().append( view.render().el );
  //Papers.fetch();
}


function parseQueryString(queryString) {
    var params = {};
    if(queryString){
        _.each(
            _.map(decodeURI(queryString).split(/&/g),function(el,i){
                var aux = el.split('='), o = {};
                if(aux.length >= 1){
                    var val = undefined;
                    if(aux.length == 2)
                        val = aux[1];
                    o[aux[0]] = val;
                }
                return o;
            }),
            function(o){
                _.extend(params,o);
            }
        );
    }
    return params;
}
