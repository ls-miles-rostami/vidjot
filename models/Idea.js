const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = Schema({
  title: {
    required: true,
    type: String
  },
  details: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
})

const Ideas = module.exports = mongoose.model('ideas', IdeaSchema)