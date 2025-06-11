const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  coursetitle: {
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
    required: true
  },
  courselink: {
    type: String,
    required: true,

  },
  coursephoto: {
    type: String, 
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);
