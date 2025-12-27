const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { getMongoDB } = require('../config/database');
const llmService = require('../services/llmService');

// Get hint for an assignment
router.post('/',
    [
        body('assignmentId').notEmpty().withMessage('Assignment ID is required'),
        body('userQuery').optional().isString(),
        body('errorMessage').optional().isString(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { assignmentId, userQuery, errorMessage } = req.body;

            // Fetch assignment details
            const db = getMongoDB();
            const assignment = await db.collection('assignments').findOne({
                _id: assignmentId
            });

            if (!assignment) {
                return res.status(404).json({ error: 'Assignment not found' });
            }

            // Generate hint using LLM
            const hint = await llmService.generateHint({
                question: assignment.question,
                requirements: assignment.requirements,
                sampleData: assignment.sampleData,
                userQuery: userQuery || '',
                errorMessage: errorMessage || '',
            });

            res.json({
                success: true,
                hint: hint
            });
        } catch (error) {
            console.error('Error generating hint:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate hint'
            });
        }
    }
);

module.exports = router;

