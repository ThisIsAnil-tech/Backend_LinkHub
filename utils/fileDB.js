const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../storage/db.json");

const readDB = () => {
  try {
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify({ links: [] }, null, 2));
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data || '{"links":[]}');
  } catch {
    return { links: [] };
  }
};

const writeDB = (data) => {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };