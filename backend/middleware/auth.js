const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err.message);
            return res.status(403).json({ message: 'Access Denied: Invalid or expired token. Please re-login' });
        }

        // Calculate remaining time until token expiration
        if (decoded && decoded.exp) {
            const currentTime = Math.floor(Date.now() / 1000); // in seconds
            const remainingTime = decoded.exp - currentTime;

            console.log(`⏳ Token expires in: ${remainingTime} seconds`);

            // Optionally attach this info to request
            req.tokenExpirySeconds = remainingTime;
        }

        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
