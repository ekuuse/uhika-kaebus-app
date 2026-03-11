const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'You are not logged in', success: false });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'You are not logged in', success: false });
    }
    console.log("Authenticated user:", user);
    req.user = user;

    next();
  });
};

module.exports = { checkAuthenticated };