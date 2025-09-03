const express = require('express');
const router = express.Router();
const validate = require('../middleware/validation');

router.post('/send-otp',  require('../controllers/otpController').sendOTP);
router.post('/verify-otp', require('../controllers/otpController').verifyOTP);

module.exports = router;