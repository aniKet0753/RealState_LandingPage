const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const validate = require('../middleware/validation');
const { signupSchema, loginSchema } = require('../schemas/agentSchema');

router.post('/signup', validate(signupSchema), agentController.signupAgent);
router.post('/login', validate(loginSchema), agentController.loginAgent);

module.exports = router;