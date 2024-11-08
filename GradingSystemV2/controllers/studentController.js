const Grade = require('../models/grade');
const mongoose = require('mongoose');
const User = require('../models/user'); // Ensure User model is imported

// View all marks for a specific course
const viewCourseSummary = async (req, res) => {
  try {
    const { courseId } = req.query;
    const grade = await Grade.findOne({
      student: req.user._id,
      course: courseId,
    }).populate('course', 'name');

    if (!grade) {
      return res.status(404).json({ message: 'No grades found for this course' });
    }

    res.json({
      course: grade.course.name,
      marks: grade.marks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View total CA marks, average CAs, and ESE for all courses
const viewAllCoursesResult = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.user._id }).populate('course', 'name');

    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found for this student' });
    }

    const results = grades.map(grade => {
      const caComponents = [grade.marks.CA1, grade.marks.CA2, grade.marks.CA3, grade.marks.CA4];
      const validCAs = caComponents.filter(ca => ca !== undefined && ca > 0);
      const totalCAs = validCAs.reduce((sum, ca) => sum + ca, 0);
      const avgCAs = validCAs.length > 0 ? totalCAs / validCAs.length : 0;

      return {
        course: grade.course.name,
        totalCAs,
        avgCAs: avgCAs.toFixed(2),
        ESE: grade.marks.ESE || 0,
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewComponentMarks = async (req, res) => {
  try {
    const { component } = req.query;
    const grades = await Grade.find({ student: req.user._id }).populate('course', 'name');

    if (grades.length === 0) {
      return res.status(404).json({ message: 'No grades found for this student' });
    }

    const results = grades
      .filter(grade => grade.marks[component] > 0)
      .map(grade => ({
        course: grade.course.name,
        courseId: grade.course._id,
        component,
        marks: grade.marks[component],
        verificationStatus: grade.verificationStatus[component] || 'Not Verified',
      }));

    if (results.length === 0) {
      return res.status(404).json({ message: `No marks found for component ${component} for this student` });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyMarks = async (req, res) => {
  const { courseId, component } = req.body;
  const studentId = req.user._id;

  console.log('Received data for verification:', { courseId, component, studentId });

  if (!courseId || !component || !studentId) {
    return res.status(400).json({ message: 'Course ID, component, and student ID are required.' });
  }

  try {
    const grade = await Grade.findOne({
      student: new mongoose.Types.ObjectId(studentId),
      course: new mongoose.Types.ObjectId(courseId),
    });

    if (!grade) {
      return res.status(404).json({ message: 'Grade entry not found for the given student and course.' });
    }

    grade.verificationStatus = grade.verificationStatus || {};
    grade.verificationStatus[component] = 'Verified';
    await grade.save();

    res.json({ message: 'Marks verified successfully' });
  } catch (error) {
    console.error('Error during verification:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get filtered students based on batch, program, and division
const getFilteredStudents = async (req, res) => {
  const { batchId, programId, divisionId } = req.query;

  try {
    const students = await User.find({
      role: 'student',
      batchId,
      programId,
      divisionId,
    }).select('name PRN batchId programId divisionId');

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the selected filters.' });
    }

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all functions, including getFilteredStudents
module.exports = {
  viewCourseSummary,
  viewAllCoursesResult,
  viewComponentMarks,
  verifyMarks,
  getFilteredStudents,
};
