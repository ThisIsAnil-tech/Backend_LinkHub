const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const protectAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("No token provided", { headers: req.headers });
      return res.status(401).json({ message: "No token provided" });
    }
    
    const token = authHeader.split(" ")[1];
    
    if (process.env.NODE_ENV === 'development' && token === "dev-token") {
      req.admin = { role: "admin-dev" };
      return next();
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = decoded;
      next();
    } catch (jwtError) {
      logger.error("Invalid token", { error: jwtError.message });
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    logger.error("Auth middleware error", { error: err.message, stack: err.stack });
    return res.status(500).json({ message: "Authentication error" });
  }
};

module.exports = protectAdmin;