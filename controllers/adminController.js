const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { readAdmins, writeAdmins } = require("../utils/adminDB");
const logger = require("../utils/logger");

exports.registerAdmin = async (req, res) => {
  try {
    logger.access(req, { body: { ...req.body, password: '[REDACTED]' } });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    
    const db = readAdmins();
    const exists = db.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      logger.error("Admin already exists", { email });
      return res.status(400).json({ message: "Admin already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = {
      _id: Date.now().toString(),
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date()
    };
    
    db.admins.push(newAdmin);
    writeAdmins(db);
    
    logger.info("Admin created successfully", { email });
    res.json({ message: "Admin created" });
  } catch (err) {
    logger.error("Error creating admin", { error: err.message, stack: err.stack });
    res.status(500).json({ message: "Error creating admin" });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    logger.access(req, { body: { ...req.body, password: '[REDACTED]' } });
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    
    const db = readAdmins();
    const admin = db.admins.find(
      a => a.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!admin) {
      logger.error("Login failed - invalid email", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      logger.error("Login failed - wrong password", { email });
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    logger.info("Login successful", { email });
    res.json({ token });
  } catch (err) {
    logger.error("Login error", { error: err.message, stack: err.stack });
    res.status(500).json({ message: "Login error" });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    logger.access(req, { 
      body: { 
        ...req.body, 
        currentPassword: '[REDACTED]',
        newPassword: '[REDACTED]' 
      } 
    });
    
    const { currentPassword, newEmail, newPassword } = req.body;
    
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password required" });
    }
    
    const db = readAdmins();
    const admin = db.admins.find(a => a.email === req.admin.email);
    
    if (!admin) {
      logger.error("Admin not found for update", { email: req.admin.email });
      return res.status(404).json({ message: "Admin not found" });
    }
    
    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
      logger.error("Update failed - wrong current password", { email: req.admin.email });
      return res.status(401).json({ message: "Wrong current password" });
    }
    
    if (newEmail && newEmail.trim() !== "") {
      const emailExists = db.admins.find(a => 
        a.email.toLowerCase() === newEmail.toLowerCase() && 
        a._id !== admin._id
      );
      
      if (emailExists) {
        logger.error("Update failed - email already exists", { newEmail });
        return res.status(400).json({ message: "Email already in use" });
      }
      
      admin.email = newEmail.toLowerCase();
    }
    
    if (newPassword && newPassword.trim() !== "") {
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      admin.password = await bcrypt.hash(newPassword, 10);
    }
    
    writeAdmins(db);
    
    logger.info("Admin updated successfully", { email: admin.email });
    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    logger.error("Update failed", { error: err.message, stack: err.stack });
    res.status(500).json({ message: "Update failed" });
  }
};