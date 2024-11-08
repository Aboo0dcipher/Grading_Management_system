const express = require('express');
const { registerStudent, registerFaculty, loginUser ,registerAdmin} = require('../controllers/authController');
const router = express.Router();

// POST /api/auth/register - Register student
router.post('/register', registerStudent);

// POST /api/auth/register/faculty - Register faculty (for admins)
router.post('/register/faculty', registerFaculty);

// POST /api/auth/login - Login for both students and faculty
router.post('/login', loginUser);
router.post('/register-admin', registerAdmin);

module.exports = router;
