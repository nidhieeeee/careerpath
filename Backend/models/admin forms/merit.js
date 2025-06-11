const mongoose = require("mongoose");

const meritSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  document: {
    type: String,  
    required: false,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Merit", meritSchema);
