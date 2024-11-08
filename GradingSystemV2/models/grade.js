const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the student
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',  // Reference to the course
    required: true,
  },
  marks: {
    CA1: { type: Number, default: 0 },  // Marks for CA1
    CA2: { type: Number, default: 0 },  // Marks for CA2
    CA3: { type: Number, default: 0 },  // Marks for CA3 (if applicable)
    CA4: { type: Number, default: 0 },  // Marks for CA4 (if applicable)
    ESE: { type: Number, default: 0 },  // Marks for the final exam (ESE)
  },
  //new schema for the verification 
  verificationStatus: {
    CA1: { type: String, default: 'Not Verified' },
    CA2: { type: String, default: 'Not Verified' },
    CA3: { type: String, default: 'Not Verified' },
    CA4: { type: String, default: 'Not Verified' },
    ESE: { type: String, default: 'Not Verified' },
  },
}, {
  timestamps: true,
});

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;




