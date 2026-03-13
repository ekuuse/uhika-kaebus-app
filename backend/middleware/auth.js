const jwt = require('jsonwebtoken');

const checkAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'You are not logged in', success: false });
  }
  
  jwt.verify(token, Bun.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'You are not logged in', success: false });
    }
    console.log("Authenticated user:", user);
    req.user = user;

    next();
  });
};

const checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.',
    });
  }

  next();
};

module.exports = { checkAuthenticated, checkAdmin };