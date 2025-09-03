const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authenticateToken = require('../middleware/auth');
const validate = require('../middleware/validation');
const { addLeadSchema } = require('../schemas/leadSchema');

router.post('/', authenticateToken, validate(addLeadSchema), leadController.addLead);

module.exports = router;