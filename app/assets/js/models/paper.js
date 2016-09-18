"use strict";
// Backbone Model: Paper

// Includes
var Backbone = require('backbone')
require('backbone.localstorage')

// LokiJS - Data is held in filebased db - uses sync override.
var Loki = require('lokijs')
var LokiDB = new Loki('lokidb.json');
LokiDB.addCollection('papers');

//var diskdb = require('diskdb')
//diskdb = diskdb.connect('diskdb.json', ['papers'])


var $ = window.$;

// Resources:
// https://github.com/jashkenas/backbone/issues/56#issuecomment-15646745

var getKeys = function(obj) {
  var keys = [];
  for(var key in obj){
    keys.push(key);
  }
  return keys;
}


/**
 * Returns the JSON representation of an object.
 *
 * @param {value} object the object
 * @param {number} objectMaxDepth for objects, the maximum number of times to recurse into descendants
 * @param {number} arrayMaxLength for arrays, the maximum number of elements to enumerate
 * @param {string} indent the string to use for indentation
 * @return {string} the JSON representation
 */
var toJSONLimits = function(object, objectMaxDepth, arrayMaxLength, indent)
{
    "use strict";

    /**
     * Escapes control characters, quote characters, backslash characters and quotes the string.
     *
     * @param {string} string the string to quote
     * @returns {String} the quoted string
     */
    function quote(string)
    {
        escapable.lastIndex = 0;
        var escaped;
        if (escapable.test(string))
        {
            escaped = string.replace(escapable, function(a)
            {
                var replacement = replacements[a];
                if (typeof (replacement) === "string")
                    return replacement;
                // Pad the unicode representation with leading zeros, up to 4 characters.
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }
        else
            escaped = string;
        return "\"" + escaped + "\"";
    }

    /**
     * Returns the String representation of an object.
     *
     * Based on <a href="https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js">https://github.com/Canop/JSON.prune/blob/master/JSON.prune.js</a>
     *
     * @param {string} path the fully-qualified path of value in the JSON object
     * @param {type} value the value of the property
     * @param {string} cumulativeIndent the indentation to apply at this level
     * @param {number} depth the current recursion depth
     * @return {String} the JSON representation of the object, or "null" for values that aren't valid
     * in JSON (e.g. infinite numbers).
     */
    function toString(path, value, cumulativeIndent, depth)
    {
        switch (typeof (value))
        {
            case "string":
                return quote(value);
            case "number":
                {
                    // JSON numbers must be finite
                    if (isFinite(value))
                        return String(value);
                    return "null";
                }
            case "boolean":
                return String(value);
            case "object":
                {
                    if (!value)
                        return "null";
                    var valueIndex = values.indexOf(value);
                    if (valueIndex !== -1)
                        return "Reference => " + paths[valueIndex];
                    values.push(value);
                    paths.push(path);
                    if (depth > objectMaxDepth)
                        return "...";

                    // Make an array to hold the partial results of stringifying this object value.
                    var partial = [];

                    // Is the value an array?
                    var i;
                    if (Object.prototype.toString.apply(value) === "[object Array]")
                    {
                        // The value is an array. Stringify every element
                        var length = Math.min(value.length, arrayMaxLength);

                        // Whether a property has one or multiple values, they should be treated as the same
                        // object depth. As such, we do not increment the object depth when recursing into an
                        // array.
                        for (i = 0; i < length; ++i)
                        {
                            partial[i] = toString(path + "." + i, value[i], cumulativeIndent + indent, depth,
                                arrayMaxLength);
                        }
                        if (i < value.length)
                        {
                            // arrayMaxLength reached
                            partial[i] = "...";
                        }
                        return "\n" + cumulativeIndent + "[" + partial.join(", ") + "\n" + cumulativeIndent +
                            "]";
                    }

                    // Otherwise, iterate through all of the keys in the object.
                    for (var subKey in value)
                    {
                        if (Object.prototype.hasOwnProperty.call(value, subKey))
                        {
                            var subValue;
                            try
                            {
                                subValue = toString(path + "." + subKey, value[subKey], cumulativeIndent + indent,
                                    depth + 1);
                                partial.push(quote(subKey) + ": " + subValue);
                            }
                            catch (e)
                            {
                                // this try/catch due to forbidden accessors on some objects
                                if (e.message)
                                    subKey = e.message;
                                else
                                    subKey = "access denied";
                            }
                        }
                    }
                    var result = "\n" + cumulativeIndent + "{\n";
                    for (i = 0; i < partial.length; ++i)
                        result += cumulativeIndent + indent + partial[i] + ",\n";
                    if (partial.length > 0)
                    {
                        // Remove trailing comma
                        result = result.slice(0, result.length - 2) + "\n";
                    }
                    result += cumulativeIndent + "}";
                    return result;
                }
            default:
                return "null";
        }
    }

    if (indent === undefined)
        indent = "  ";
    if (objectMaxDepth === undefined)
        objectMaxDepth = 0;
    if (arrayMaxLength === undefined)
        arrayMaxLength = 50;
    // Matches characters that must be escaped
    var escapable =
        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    // The replacement characters
    var replacements =
        {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            "\"": "\\\"",
            "\\": "\\\\"
        };
    // A list of all the objects that were seen (used to avoid recursion)
    var values = [];
    // The path of an object in the JSON object, with indexes corresponding to entries in the
    // "values" variable.
    var paths = [];
    return toString("root", object, "", 0);
};




// Override the global backbone sync
Backbone.sync = function(method, model, options) {

  console.log("Backbone::sync method=" + method + " model=" + model);

  var lokiCollection = LokiDB.getCollection('papers'); // Can use the URL here later

  var resp, errorMessage;
  try {

    switch (method) {
      case "read":
        resp = model.id != undefined ? lokiCollection.find(model.toJSON()) : lokiCollection.find();
        //resp = model.id != undefined ? diskdb.papers.find(model) : diskdb.papers.find();
        break;
      case "create":
        resp = lokiCollection.insertOne(model.toJSON());
        //resp = diskdb.papers.insertOne(model);

        break;
      case "update":
        var jsonStr = JSON.stringify(model);
        console.log('jsonStr=' + jsonStr);
        resp = lokiCollection.update(model.toJSON());
        //resp = diskdb.papers.update(model);

        break;
      case "delete":
        resp = lokiCollection.destroy(model.toJSON());
        //resp = diskdb.papers.destroy(model);

        break;
    }

  } catch(error) {
      errorMessage = error.message;

      console.log('errorMessage=' + errorMessage);
  }


  try {
    LokiDB.save();
  } catch(error) {
    errorMessage = error;

    console.log('LokiDB.save() :: errorMessage=' + errorMessage);
  }



  console.log('resp=' + resp);
  if (resp) {
    console.log('resp.keys=' + getKeys(resp));

    if (options && options.success) {
      if (Backbone.VERSION === "0.9.10") {
        options.success(model, resp, options);
      } else {
        options.success(resp);
      }
    }
  } else {
    errorMessage = errorMessage ? errorMessage
                                : "Record Not Found";

    if (options && options.error)
      if (Backbone.VERSION === "0.9.10") {
        options.error(model, errorMessage, options);
      } else {
        options.error(errorMessage);
      }
  }

  // add compatibility with $.ajax
  // always execute callback for success and error
  if (options && options.complete) options.complete(resp);

};







var Paper = Backbone.Model.extend({
  // Set the idAttribute (Backbone Model) to use the LokiJS controlled attribute.
  // i.e. id: return $loki,
  idAttribute: "$loki",
  //lokiDb: LokiDB,
  //lokiCollection: LokiDB.getCollection('papers'),


  // diskdb
  //idAttribute: "_id",


/*
  constructor: function() {
    // Notes Collection
    //this.notes = new NoteList(null, {paper: this});
    //this.notes.on('change', this.save, this);

    Backbone.Model.apply(this, arguments);
  },
*/

/*
  parse: function(resp) {
    // Notes Collection
    //this.notes.set(resp.notes, {parse: true, remove: false});
    //delete resp.notes;

    return resp;
  },

  toJSON: function() {
    console.log('Paper::toJSON');
    //var attrs = _.clone(this.attributes);

    //delete attrs.collection;

    //                     object, objectMaxDepth, arrayMaxLength, indent
    //var str = toJSONLimits(this, 5, 100, '  ');
    //console.log(str);

    // Notes Collection
    //attrs.notes = this.notes.toJSON();

    return this;
  },
*/

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

    urlRoot: '/papers',
});
