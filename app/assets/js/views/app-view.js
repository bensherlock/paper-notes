var Backbone = require('backbone')
var _ = require('underscore')

var AppView = Backbone.View.extend({
  el: $("#paperapp"),

  statsTemplate: _.template($('#stats-template').html()),

  events: {
    "keypress #new-todo":  "createOnEnter",
  },

  initialize: function() {

    this.input = this.$("#new-paper");

    this.listenTo(Papers, 'add', this.addOne);
    this.listenTo(Papers, 'reset', this.addAll);
    this.listenTo(Papers, 'all', this.render);

    this.footer = this.$('footer');
    this.main = $('#main');

    Papers.fetch();
  },

  render: function() {
    if (Papers.length) {
      this.main.show();
      this.footer.show();
      this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
    } else {
      this.main.hide();
      this.footer.hide();
    }
  },

  addOne: function(todo) {
    var view = new PaperView({model: paper});
    this.$("#paper-list").append(view.render().el);
  },

  addAll: function() {
    Papers.each(this.addOne, this);
  },

  createOnEnter: function(e) {
    if (e.keyCode != 13) return;
    if (!this.input.val()) return;

    Papers.create({title: this.input.val()});
    this.input.val('');
  },

});

var appview = new AppView;
