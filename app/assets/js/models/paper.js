// Backbone Model: Paper

// Includes
var Backbone = require('backbone')
var $ = window.$;

// Resources:
// https://github.com/jashkenas/backbone/issues/56#issuecomment-15646745


var Paper = Backbone.Model.extend({

  constructor: function() {
    // Annotations Collection
    this.annotations = new AnnotationList(null, {paper: this});
    this.annotations.on('change', this.save, this);

    // Notes Collection
    this.notes = new NoteList(null, {paper: this});
    this.notes.on('change', this.save, this);

    Backbone.Model.apply(this, arguments);
  },

  parse: function(resp) {
    // Annotations Collection
    this.annotations.set(resp.annotations, {parse: true, remove: false});
    delete resp.annotations;

    // Notes Collection
    this.notes.set(resp.notes, {parse: true, remove: false});
    delete resp.notes;

    return resp;
  },

  toJSON: function() {
    var attrs = _.clone(this.attributes);

    // Annotations Collection
    attrs.annotations = this.annotations.toJSON();

    // Notes Collection
    attrs.notes = this.notes.toJSON();

    return attrs;
  },


  defaults: function() {
      return {
        key: "",
        authors: [""],
        title: "",
        year: 2016,
        overview: "",
        tags: [],

        order: Papers.nextOrder()
      };
    },

    //urlRoot: '/papers',
});
