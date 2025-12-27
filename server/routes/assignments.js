const express = require('express');
const router = express.Router();
const { getMongoDB } = require('../config/database');

// Get all assignments
router.get('/', async (req, res) => {
    try {
        const db = getMongoDB();
        const assignments = await db.collection('assignments').find({}).toArray();
        res.json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ error: 'Failed to fetch assignments' });
    }
});

// Get single assignment by ID
router.get('/:id', async (req, res) => {
    try {
        const db = getMongoDB();
        // Try to find by _id (string) first, as we're using string IDs in init script
        const assignment = await db.collection('assignments').findOne({
            _id: req.params.id
        });

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.json(assignment);
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({ error: 'Failed to fetch assignment' });
    }
});

module.exports = router;

