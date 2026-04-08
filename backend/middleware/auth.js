const jwt = require('jsonwebtoken');

const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const authenticateRequest = (req, res, next) => {
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

const checkAuthenticated = (req, res, next) => {
  authenticateRequest(req, res, next);
};

const checkAdmin = (req, res, next) => {
  if (!req.user) {
    return authenticateRequest(req, res, () => checkAdmin(req, res, next));
  }

  const role = req.user?.role;
  console.log('checkAdmin - req.user:', req.user);
  console.log('checkAdmin - req.user.role:', role);

  if (!role || String(role).toLowerCase() !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.',
      roleReceived: role ?? null
    });
  }

  next();
};

module.exports = { checkAuthenticated, checkAdmin };