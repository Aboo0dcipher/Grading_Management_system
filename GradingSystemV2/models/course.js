const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  credit: {
    type: Number,
    required: true,  // Course credit value (1, 3, or 4)
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the faculty (user) assigned to the course
    required: true,
  },
  // caComponents: {
  //   type: Number,
  //   required: true,  // Number of CA components (1, 2, 3, or 4)
  // },
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
