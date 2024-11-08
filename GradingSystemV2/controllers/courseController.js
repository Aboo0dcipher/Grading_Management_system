const Course = require('../models/course');

// Add a new course (for admin use)
const addCourse = async (req, res) => {
  const { name, credit, facultyId } = req.body;

  try {
    const course = new Course({
      name,
      credit,
      faculty: facultyId,
    });

    await course.save();
    res.status(201).json({ message: 'Course added successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addCourse };
