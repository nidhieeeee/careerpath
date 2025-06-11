const mongoose = require("mongoose");

const instituteFormSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String, 
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("InstituteForm", instituteFormSchema);
