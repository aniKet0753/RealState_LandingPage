const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token not provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authorization token not provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded && decoded.position === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired token. Please re-login' });
    }
};

module.exports = adminAuth;