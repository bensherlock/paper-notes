// Controller: ViewPaperController

// Includes
//var Backbone = require('backbone')
var $ = window.$;

// Container where the view will be rendered.
var $container = $('#app-view-container');

var editPaperController = function(id) {
  bothPaperController(id, true);
}

var viewPaperController = function(id) {
  bothPaperController(id, false);
}

var bothPaperController = function(id, editing) {
  console.log('viewPaperController: id=' + id);
  // Check a collection to see if paper with id `id` exists,
  // and if not instance a new one and fetch it.
  var paper = Papers.get(id);

  if( paper ) {
    console.log('paper is already in collection');
    var view;
    if( editing ) {
      view = new PaperEditView({model: paper});
    } else {
      view = new PaperView({model: paper});
    }

    $container.empty().append( view.render().el );
  } else {
    // Paper isn't in the collection. Fetch it.
    paper = new Paper({id: id});
    paper.fetch({
      success : function() {
        console.log('success fetching paper');
        Papers.add(paper);

        var view;
        if( editing ) {
          view = new PaperEditView({model: paper});
        } else {
          view = new PaperView({model: paper});
        }

        $container.empty().append( view.render().el );
      },
      error : function(e) {
        //console.log( 'keys:' + _.keys(err) );
        console.log('error fetching paper: ' + e.id);
      },
      complete: function () {
        //alert(' Service request completed ');
      }
    });
  }

}
