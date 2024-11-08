const express = require('express');
const { addCourse } = require('../controllers/courseController');
const router = express.Router();

// POST /api/courses - Add a new course
router.post('/', addCourse);

module.exports = router;
