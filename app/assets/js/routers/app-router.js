// Backbone Router: AppRouter

// Includes
var Backbone = require('backbone')
var $ = window.$;


var AppRouter = Backbone.Router.extend({

  routes : {
    ''                                      : viewAppController,

    'papers'                                : viewPapersController,
    'papers/search/:query'                  : viewPapersController,
    'papers/:id'                            : viewPaperController,
    'papers/:id/edit'                       : editPaperController,

    'papers/:paperId/notes/:noteId'         : viewNoteController,
    'papers/:paperId/notes/:noteId/edit'    : editNoteController,
  },

  initialize: function() {
    this.listenTo(Backbone, 'approuter:go', this.go);
  },

  // This is just a shortcut to navigate(), and it always triggers
  // the controller, which is what you'll want most of the time.
  go: function(route) {
    this.navigate(route, { trigger: true });
  }
});


$(document).ready(function(){
  var approuter = new AppRouter();

  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});
