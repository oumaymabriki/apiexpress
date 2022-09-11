const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel.js');

const protect = asyncHandler(async (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1];
  if (!token) res.status(403).json({error: "Unauthorized"})
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  next();
});

const admin = async (req, res, next) => {
  let token = req.headers.authorization.split(' ')[1];
  if (!token) res.status(403).json({error: "Forbidden"})
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id).select('-password');
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = admin, protect;