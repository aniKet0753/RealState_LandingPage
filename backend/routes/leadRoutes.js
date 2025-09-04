const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validation');
const { addLeadSchema } = require('../schemas/leadSchema');

router.post('/', authenticateToken, validate(addLeadSchema), leadController.addLead);

// Route to get all leads with pagination
// Example: /api/leads?page=1&limit=10
router.get('/', authenticateToken, leadController.getAllLeads);

// Route to get leads by status and/or source
// Example: /api/leads/filtered?status=cold&source=website
router.get('/filtered', authenticateToken, leadController.getFilteredLeads);

// Route to get a single lead by ID
// Example: /api/leads/123e4567-e89b-12d3-a456-426614174000
router.get('/:id', authenticateToken, leadController.getLeadById);

module.exports = router;