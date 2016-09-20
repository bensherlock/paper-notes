// Controller: ViewNoteController

// Includes
//var Backbone = require('backbone')
var $ = window.$;

// Container where the view will be rendered.
var $container = $('#app-view-container');

var editNoteController = function(paperId, noteId) {
  bothNoteController(paperId, noteId, true);
}

var viewNoteController = function(paperId, noteId) {
  bothNoteController(paperId, noteId, false);
}

var bothNoteController = function(paperId, noteId, editing) {
  console.log('bothNoteController: paperId=' + paperId + " noteId=" + noteId);
  // Check a collection to see if paper with id `id` exists,
  // and if not instance a new one and fetch it.
  var paper = Papers.get(paperId);

  if( paper ) {
    console.log('paper is already in collection');

    var view;
    if( editing ) {
      view = new NoteEditView({model: paper, noteId: noteId});
    } else {
      view = new NoteView({model: paper, noteId: noteId});
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
          view = new NoteEditView({model: paper, noteId: noteId});
        } else {
          view = new NoteView({model: paper, noteId: noteId});
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
