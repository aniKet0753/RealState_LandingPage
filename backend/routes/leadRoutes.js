const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, leadController.addLead);

module.exports = router;