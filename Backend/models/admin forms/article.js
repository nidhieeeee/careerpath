// models/article.js

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,

  },
  tags: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String, 
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  photo: {
    type: String, 
    default: null
  },
  document: {
    type: String, 
    default: null
  }
});

module.exports = mongoose.model('Article', articleSchema);
