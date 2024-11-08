const express = require('express');
const Division = require('../models/division');
const Program = require('../models/program');
const router = express.Router();

// Create a new division
// Create a new division
router.post('/', async (req, res) => {
  const { name, programId } = req.body;
  try {
    // Check if programId is provided
    if (!programId) {
      return res.status(400).json({ message: 'programId is required' });
    }

    // Verify that the program exists
    const program = await Program.findById(programId);
    if (!program) {
      return res.status(400).json({ message: 'Program not found' });
    }

    // Create and save division
    const division = new Division({ name, programId });
    await division.save();

    res.status(201).json({ message: 'Division created successfully', division });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all divisions
router.get('/', async (req, res) => {
  try {
    const divisions = await Division.find({})
      .populate('programId', 'name')
      .populate('batchId', 'startYear endYear');
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
