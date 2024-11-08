const express = require('express');
const { 
  viewComponentMarks, 
  viewCourseSummary, 
  viewAllCoursesResult, 
  verifyMarks, 
  getFilteredStudents  // Import the new function
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/students/marks/component - View marks for a specific component across all courses
router.get('/marks/component', protect, viewComponentMarks);

// Route to view all marks for a specific course
router.get('/marks/course-summary', protect, viewCourseSummary);

// Route to view total CA marks, average CAs, and ESE for all courses
router.get('/marks/entire-result', protect, viewAllCoursesResult);

// Route to verify marks
router.post('/marks/verify', protect, verifyMarks);

// Route to get filtered students by batch, program, and division
router.get('/filtered-students', protect, getFilteredStudents);

module.exports = router;
