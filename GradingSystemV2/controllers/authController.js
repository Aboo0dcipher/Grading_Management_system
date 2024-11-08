const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate a JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Student registration with batch, program, and division
// Student registration without hashing
const registerStudent = async (req, res) => {
  const { name, email, password, PRN, batchId, programId, divisionId } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Use plain password temporarily (no hashing)
    const user = await User.create({
      name,
      email,
      password, // Save plain password
      PRN,
      batchId,
      programId,
      divisionId,
      role: 'student',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      PRN: user.PRN,
      role: user.role,
      batchId: user.batchId,
      programId: user.programId,
      divisionId: user.divisionId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Faculty registration without hashing
const registerFaculty = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if faculty already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    // Use plain password temporarily (no hashing)
    const user = await User.create({
      name,
      email,
      password, // Save plain password
      role: 'faculty',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin registration without hashing
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if an admin already exists with this email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Create new admin user
    const user = await User.create({
      name,
      email,
      password, // Save plain password temporarily
      role: 'admin',
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// User login
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find user by email and role
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    //Temporarily remove password comparison
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { registerStudent, registerFaculty, loginUser ,registerAdmin };
