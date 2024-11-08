const User = require('../models/user');
const Course = require('../models/course');
const Batch = require('../models/batch');
const Program = require('../models/program');
const Division = require('../models/division');
const bcrypt = require('bcryptjs');

// Add a new student with batch, program, and division
const addStudent = async (req, res) => {
  const { name, email, password, PRN, batchId, programId, divisionId } = req.body;

  // Check for all required fields
  if (!name || !email || !password || !PRN || !batchId || !programId || !divisionId) {
    return res.status(400).json({ message: 'All student fields are required' });
  }

  try {
    // Check if the student already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      PRN,
      batch: batchId,  // Adjusted field name to 'batch'
      program: programId,  // Adjusted field name to 'program'
      division: divisionId,  // Adjusted field name to 'division'
      role: 'student',
    });

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new faculty
const addFaculty = async (req, res) => {
  const { name, email, password } = req.body;

  // Check for required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All faculty fields are required' });
  }

  try {
    // Check if the faculty already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Faculty already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const faculty = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'faculty',
    });

    res.status(201).json({ message: 'Faculty added successfully', faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addCourseAndAssignFaculty = async (req, res) => {
  const { name, credit, facultyId } = req.body;

  // Check for required fields
  if (!name || !credit || !facultyId) {
    return res.status(400).json({ message: 'All course fields are required' });
  }

  try {
    // Validate faculty ID
    const facultyExists = await User.findById(facultyId);
    if (!facultyExists) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    // Create the course
    const course = await Course.create({ name, credit, faculty: facultyId });
    res.status(201).json({ message: 'Course added and linked to faculty', course });
  } catch (error) {
    console.error('Error adding course:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error while adding course' });
  }
};


// Add a new batch
const addBatch = async (req, res) => {
  const { name, startYear, endYear } = req.body;

  // Check for required fields
  if (!name || !startYear || !endYear) {
    return res.status(400).json({ message: 'All batch fields are required' });
  }

  try {
    const batch = await Batch.create({ name, startYear, endYear });
    res.status(201).json({ message: 'Batch added successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new program
const addProgram = async (req, res) => {
  const { name, description } = req.body;

  // Check for required fields
  if (!name) {
    return res.status(400).json({ message: 'Program name is required' });
  }

  try {
    const program = await Program.create({ name, description });
    res.status(201).json({ message: 'Program added successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new division linked to a program
const addDivision = async (req, res) => {
  const { name, programId } = req.body;

  // Check for required fields
  if (!name || !programId) {
    return res.status(400).json({ message: 'Division name and program ID are required' });
  }

  try {
    const division = await Division.create({ name, program: programId });  // Adjusted field name to 'program'
    res.status(201).json({ message: 'Division added successfully', division });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all programs
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
};

// Get all batches
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch batches' });
  }
};
// Get all faculty members
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: 'faculty' }).select('-password'); // Exclude password from response
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch faculty members' });
  }
};


// Get all divisions
const getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find();
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch divisions' });
  }
};

module.exports = {
  addStudent,
  addFaculty,
  addCourseAndAssignFaculty,
  addBatch,
  addProgram,
  addDivision,
  getAllPrograms,
  getAllBatches,
  getAllDivisions,
  getAllFaculties,
};
