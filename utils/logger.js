const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const errorLogPath = path.join(logsDir, 'error.log');
const accessLogPath = path.join(logsDir, 'access.log');
const deletionLogPath = path.join(logsDir, 'deletion.log');

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...data
  }) + '\n';
};

const logger = {
  error: (message, data = {}) => {
    const logMessage = formatLog('ERROR', message, data);
    fs.appendFileSync(errorLogPath, logMessage);
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, data);
    }
  },

  access: (req, data = {}) => {
    const logMessage = formatLog('ACCESS', `${req.method} ${req.url}`, {
      ip: req.ip,
      method: req.method,
      url: req.url,
      ...data
    });
    fs.appendFileSync(accessLogPath, logMessage);
  },

  deletion: (message, data = {}) => {
    const logMessage = formatLog('DELETION', message, data);
    fs.appendFileSync(deletionLogPath, logMessage);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DELETION] ${message}`, data);
    }
  },

  info: (message, data = {}) => {
    const logMessage = formatLog('INFO', message, data);
    fs.appendFileSync(accessLogPath, logMessage);
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  }
};

module.exports = logger;