"use strict";
// Backbone View: View Papers

// Includes
var Backbone = require('backbone');
var _ = require('underscore');
// With Underscore
require("underscore-query")(_);

var $ = window.$;

//'#' = id, '.'=class

var PapersView = Backbone.View.extend({
  logTag: 'PapersView',

  template: _.template($('#papers-view-template').html()),

  events: {
    //'keypress #paper-create-form':  'createOnEnter',

    'submit #search-form' : 'onSearch',

    'submit #paper-create-form' : 'onSubmit',
  },

  initialize: function() {
    console.log(this.logTag + '::' + 'initialize');

    this.$el.html(this.template);

    //_.bindAll(this, 'render', 'addOne', 'addAll', 'createOnEnter', 'showAlert');

    //console.log('AppView::initialize DOMisReady=' + $.isReady);


    this.listenTo(Papers, 'add', this.addOne);
    this.listenTo(Papers, 'reset', this.addAll);
    this.listenTo(Papers, 'all', this.render);


    // Fetch from server/db - and reset to force a render
    //console.log(this.logTag + '::' + 'fetching(reset=false)...');
    Papers.fetch();
    //console.log(this.logTag + '::' + 'fetched');

    // For demosntration/testing we'll clear the database
    // then add a single example.

    ///*
    // Delete all existing first
    _.invoke(Papers.toArray(), 'destroy');

    // Insert a new paper into the papers (and sync)
    Papers.create( {
      title: 'A paper title',
      key: "smith2016about",
      year: 2016,
      authors: ["Smith, A.N."],
      notes: [{
        title: "A note",
        datetime: "2016-09-13T09:36:00Z",
        text: "A load of text about something of interest."
      }],
      tags: ["ieee", "iet"]
    } );
    //*/

  },

  render: function() {
    //console.log(this.logTag + '::' + 'render Papers.length=' + Papers.length);
    if (Papers.length) {
      this.$('#main').show();

      // Add all
      this.addAll();

    } else {
      this.$('#main').hide();
    }

    return this;
  },

  addOne: function(paper) {
    //console.log(this.logTag + '::' + 'addOne paper=' + JSON.stringify(paper));
    var view = new PapersItemView({model: paper});
    this.$("#paper-list").append(view.render().el);
  },

  addAll: function() {
    //console.log(this.logTag + '::' + 'addAll');
    this.$("#paper-list").empty();

    if( !this.$('#search').val() ) {
      //Add all in the collection
      Papers.each(this.addOne, this);
    } else {
      // Filter the Papers collection using the search input value
      var queryText = this.$('#search').val();

      // Use underscore-query to build the query
      //key: "",
      //authors: [""],
      //title: "",
      //year: 2016,
      //overview: "",
      //tags: [],
      //console.log('queryText=' + queryText);
      var theQuery = _.query.build().getter('get')
      //  .and('title', {$likeI: queryText });
        .or("title", {$likeI: queryText })
        .or("key", {$likeI: queryText })
        .or("tags", { $contains: queryText })
        .or("overview", {$likeI: queryText });

      // Then apply it to Papers
      var filtered = theQuery.all( Papers.models );
      //console.log('filtered:length=' + filtered.length);

      for(var i = 0; i < filtered.length; i++ ) {
        this.addOne( filtered[i] );
      }
    }
  },

  createOnEnter: function(e) {
    //console.log(this.logTag + '::' + 'createOnEnter e=' + e.keyCode);
    if (e.keyCode != 13) return;
    if (!this.$('#key').val()) return;

    var paper = Papers.create({key: this.$('#key').val()});
    //this.input.val('');
    // Now jump to edit page
    Backbone.trigger('approuter:go', "/papers/" + paper.id + "/edit");
  },

  onSubmit : function(event) {
    event.preventDefault();

    var paper = Papers.create({key: this.$('#key').val()});
    // Now jump to edit page
    Backbone.trigger('approuter:go', "/papers/" + paper.id + "/edit");
  },

  onSearch : function(event) {
    event.preventDefault();

    var query = this.$('#search').val();

    this.addAll();

    // Encode?
    // Now jump to edit page
    //Backbone.trigger('approuter:go', "/papers/search/" + query);
  },


  get_type: function(thing) {
    if(thing===null)return "[object Null]"; // special case
    //return Object.prototype.toString.call(thing);
    return thing.constructor.name;
  },

  showAlert : function() {
    alert('You clicked me');
  },



});
