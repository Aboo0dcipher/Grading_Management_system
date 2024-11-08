const express = require('express');
const Program = require('../models/program');
const router = express.Router();

// Create a new program
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const program = new Program({ name });
    await program.save();
    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all programs
router.get('/', async (req, res) => {
  try {
    const programs = await Program.find({});
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
