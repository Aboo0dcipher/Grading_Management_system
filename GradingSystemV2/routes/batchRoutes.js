const express = require('express');
const Batch = require('../models/batch');
const router = express.Router();

// Create a new batch
router.post('/', async (req, res) => {
  const { startYear, endYear } = req.body;
  try {
    const batch = new Batch({ startYear, endYear });
    await batch.save();
    res.status(201).json({ message: 'Batch created successfully', batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all batches
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find({});
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
