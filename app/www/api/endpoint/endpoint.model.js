'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// The model for endpoint documents
var EndpointSchema = new Schema({
  name: String,
  baseUrl: { // complete url, e.g.: 'http[s]://localhost:5000'
    type: String,
    required: true
  },
  subdirectory: { // e.g. '/customers'
    type: String,
    required: true
  },
  description: String,
  routes: [{
    name: String,
    subdirectory: { // e.g. '/fetchAndClean'
      type: String,
      required: true
    },
    schedule: String // Schedule to be parsed by later.js, e.g. 'every 15 minutes', docs in README
  }],
  dateCreated: { // Set automatically
    type: Date,
    default: Date.now
  },
  dateModified: { // Set automatically
    type: Date,
    default: Date.now
  },
  disabled: Boolean // Set automatically
});

// Called every time just before an Endpoint document is saved
EndpointSchema.pre('save', function (next) {
  this.dateModified = new Date();
  
  next();
});

module.exports = mongoose.model('Endpoint', EndpointSchema);