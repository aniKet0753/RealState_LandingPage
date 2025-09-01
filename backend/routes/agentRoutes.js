const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/signup', agentController.signupAgent);
router.post('/login', agentController.loginAgent);

module.exports = router;