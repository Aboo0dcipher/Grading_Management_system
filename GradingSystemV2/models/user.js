const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() { return this.role === 'student'; },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  PRN: {
    type: String,
    required: function() { return this.role === 'student'; },
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    required: true,
  },
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
  },
  divisionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division',
  }
}, {
  timestamps: true,
});

// // Password hashing logic
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     return next(); // Skip if the password hasn't changed
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model('User', userSchema);
module.exports = User;
