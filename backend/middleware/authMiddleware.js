const jwt = require('jsonwebtoken');

const verifyAuthToken = (req, res, next) => {
  try {
    const token = req.header('authorization');

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized user' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = verifyAuthToken;
