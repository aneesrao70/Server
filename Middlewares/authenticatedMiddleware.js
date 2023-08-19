const jwt = require('jsonwebtoken');
const secretKey = 'umerjavaid12@'; // Replace with your actual secret key

const authenticateMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = { _id: decodedToken.userId }; // Attach the user ID to the request object
    next(); // Continue to the next middleware/route
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateMiddleware;
