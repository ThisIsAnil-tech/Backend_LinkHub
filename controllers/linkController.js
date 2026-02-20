const { readDB, writeDB } = require("../utils/fileDB");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

const deleteLogoFile = (logoUrl) => {
  if (!logoUrl) return false;
  
  try {
    const filename = path.basename(logoUrl);
    const filePath = path.join(__dirname, "..", "store-logo", filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.deletion(`Logo file deleted`, { filename, path: filePath });
      return true;
    } else {
      logger.deletion(`Logo file not found`, { filename, path: filePath });
      return false;
    }
  } catch (err) {
    logger.error(`Error deleting logo file`, { 
      logoUrl, 
      error: err.message,
      stack: err.stack 
    });
    return false;
  }
};

exports.getLinks = async (req, res) => {
  try {
    logger.access(req);
    const db = readDB();
    res.json(db.links);
  } catch (error) {
    logger.error("Error reading links", { error: error.message, stack: error.stack });
    res.status(500).json({ message: "Error reading links" });
  }
};

exports.addLink = async (req, res) => {
  try {
    logger.access(req, { body: { ...req.body, logo: req.file ? 'present' : 'none' } });
    
    const { siteName, username, profileLink, category, visible } = req.body;
    const db = readDB();
    
    if (!siteName || !username || !profileLink) {
      if (req.file) {
        deleteLogoFile(req.file.filename);
      }
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const logoPath = req.file ? `/logos/${req.file.filename}` : "";
    
    const newLink = {
      _id: Date.now().toString(),
      siteName,
      username,
      profileLink,
      logoUrl: logoPath,
      category: category || "General",
      visible: visible !== "false",  
      clicks: 0,
      createdAt: new Date()
    };
    
    db.links.unshift(newLink);
    writeDB(db);
    
    logger.info("Link added successfully", { linkId: newLink._id, siteName });
    res.status(201).json(newLink);
  } catch (err) {
    logger.error("Error saving link", { error: err.message, stack: err.stack });
    if (req.file) {
      deleteLogoFile(req.file.filename);
    }
    res.status(500).json({ message: "Error saving link" });
  }
};

exports.deleteLink = (req, res) => {
  try {
    logger.access(req, { params: req.params });
    
    const db = readDB();
    const index = db.links.findIndex(l => l._id === req.params.id);
    
    if (index === -1) {
      logger.error("Link not found for deletion", { linkId: req.params.id });
      return res.status(404).json({ message: "Not found" });
    }
    
    const link = db.links[index];
    
    if (link.logoUrl) {
      deleteLogoFile(link.logoUrl);
    }
    
    db.links.splice(index, 1);
    writeDB(db);
    
    logger.deletion("Link deleted successfully", { 
      linkId: link._id, 
      siteName: link.siteName,
      hadLogo: !!link.logoUrl 
    });
    
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    logger.error("Delete failed", { 
      error: err.message, 
      stack: err.stack,
      linkId: req.params.id 
    });
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.trackClick = (req, res) => {
  try {
    logger.access(req, { params: req.params });
    
    const db = readDB();
    const link = db.links.find(l => l._id === req.params.id);
    
    if (!link) {
      logger.error("Link not found for click tracking", { linkId: req.params.id });
      return res.status(404).json({ message: "Link not found" });
    }
    
    link.clicks = (link.clicks || 0) + 1;
    writeDB(db);
    
    logger.info("Click tracked", { linkId: link._id, totalClicks: link.clicks });
    res.json({ ok: true });
  } catch (err) {
    logger.error("Click track failed", { 
      error: err.message, 
      stack: err.stack,
      linkId: req.params.id 
    });
    res.status(500).json({ message: "Click track failed" });
  }
};