const express = require('express');
const { 
  getAssignedCourses, 
  enterMarks, 
  getAllStudents, 
  getMarksForCourseComponent, 
  updateMarks 
} = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to get courses assigned to a faculty
router.get('/courses', protect, getAssignedCourses);

// Route to enter marks for students
router.post('/marks', protect, enterMarks);

// Route to update marks for a specific student and component
router.put('/marks', protect, updateMarks);

// Route to get all students
router.get('/students', protect, getAllStudents);

// Route to get marks for a specific course and component
router.get('/marks', protect, getMarksForCourseComponent);

module.exports = router;
