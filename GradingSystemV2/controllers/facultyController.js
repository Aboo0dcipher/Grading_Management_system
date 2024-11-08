const Course = require('../models/course');
const Grade = require('../models/grade');  // Ensure you have imported all necessary models
const User = require('../models/user');

// Fetch all students (students with role 'student')
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('name PRN');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get courses assigned to the logged-in faculty
const getAssignedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ faculty: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get marks for a specific course component
const getMarksForCourseComponent = async (req, res) => {
  const { courseId, component } = req.query;

  try {
    // Fetch all students enrolled in the course
    const students = await User.find({ role: 'student' }).select('name PRN');
    
    // Fetch grades for the given course and component
    const grades = await Grade.find({ course: courseId }).populate('student', 'name PRN');

    // Create a map of student grades for easy access
    const gradeMap = grades.reduce((map, grade) => {
      map[grade.student._id] = grade;
      return map;
    }, {});

    // Create the response array with marks data, including students without grades
    const marksData = students.map(student => {
      const grade = gradeMap[student._id];
      return {
        studentId: student._id,
        studentName: student.name,
        studentPRN: student.PRN,
        marks: grade ? grade.marks[component] || '0' : 'No marks entered', // here to show 0 if 0 otherwise No marks entered
        verificationStatus: grade ? grade.verificationStatus[component] || 'Not Verified' : 'Not Verified' // Add verification status
      };
    });

    res.json(marksData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enter marks for students
const enterMarks = async (req, res) => {
  const { marks } = req.body;

  try {
    for (const markEntry of marks) {
      let grade = await Grade.findOne({ student: markEntry.studentId, course: markEntry.courseId });
      if (grade) {
        grade.marks[markEntry.component] = markEntry.marks;
        grade.verificationStatus[markEntry.component] = 'Not Verified'; // Reset verification status after entering marks
        await grade.save();
      } else {
        const newGrade = new Grade({
          student: markEntry.studentId,
          course: markEntry.courseId,
          marks: { [markEntry.component]: markEntry.marks },
          verificationStatus: { [markEntry.component]: 'Not Verified' } // Set initial verification status to 'Not Verified'
        });
        await newGrade.save();
      }
    }
    res.json({ message: 'Marks saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMarks = async (req, res) => {
  const { studentId, courseId, component, marks } = req.body;
  console.log(`Received studentId: ${studentId}, courseId: ${courseId}, component: ${component}, marks: ${marks}`);
  
  try {
    const grade = await Grade.findOne({ student: studentId, course: courseId });

    if (!grade) {
      return res.status(404).json({ message: 'Grade entry not found' });
    }

    // Update the specific component marks
    grade.marks[component] = marks;
    grade.verificationStatus[component] = 'Not Verified'; // Reset verification status after updating marks
    await grade.save();

    res.json({ message: 'Marks updated successfully', grade });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignedCourses, enterMarks, getAllStudents, getMarksForCourseComponent, updateMarks };