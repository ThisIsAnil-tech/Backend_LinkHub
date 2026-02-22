require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const adminRoutes = require("./routes/adminRoutes");
const linkRoutes = require("./routes/linkRoutes");
const logger = require("./utils/logger");

const app = express();

const uploadDir = path.join(__dirname, "store-logo");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info("Upload directory created", { path: uploadDir });
}

const allowedOrigins = [
  'https://frontend-link-hub.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy blocked this request';
      logger.error(msg, { origin });
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use((req, res, next) => {
  logger.access(req);
  next();
});

app.use(express.json());

app.use("/logos", express.static(path.join(__dirname, "store-logo")));

app.use("/api/links", linkRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "LinkHub API Running",
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/api/test", (req, res) => {
  res.json({ 
    message: "API is working!", 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.use('*', (req, res) => {
  logger.error("Route not found", { method: req.method, url: req.url });
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  logger.error("Unhandled error", { 
    error: err.message, 
    stack: err.stack,
    url: req.url,
    method: req.method 
  });
  
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

process.on('uncaughtException', (err) => {
  logger.error("Uncaught Exception", { error: err.message, stack: err.stack });
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error("Unhandled Rejection", { error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started`, { port: PORT, env: process.env.NODE_ENV || 'development' });
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
