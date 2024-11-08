const express = require('express');
const {
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
} = require('../controllers/adminController'); // Updated to use adminController functions

const router = express.Router();

// Add a new student
router.post('/add-student', addStudent);

// Add a new faculty
router.post('/add-faculty', addFaculty);

// Add a new course and link to faculty
router.post('/add-course', addCourseAndAssignFaculty);

// Add a new batch
router.post('/add-batch', addBatch);

// Add a new program
router.post('/add-program', addProgram);

// Add a new division
router.post('/add-division', addDivision);

// Fetch all programs
router.get('/programs', getAllPrograms);

// Fetch all batches
router.get('/batches', getAllBatches);

// Fetch all divisions (with optional program filter)
router.get('/divisions', getAllDivisions);

router.get('/faculties', getAllFaculties);

module.exports = router;
