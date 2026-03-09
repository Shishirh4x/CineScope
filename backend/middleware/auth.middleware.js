import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect routes — user must be logged in with a valid JWT
export const protect = async (req, res, next) => {
  try {
    let token;

    // Read token from Authorization header: "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not logged in. Please sign in.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ success: false, message: 'Your account has been suspended.' });
    }

    req.user = user; // attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Admin only — must be used AFTER protect middleware
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};
