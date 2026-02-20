const fs = require("fs");
const path = require("path");

const adminPath = path.join(__dirname, "../json/admins.json");

const readAdmins = () => {
  try {
    const data = fs.readFileSync(adminPath,"utf-8");
    return JSON.parse(data || '{"admins":[]}');
  } catch {
    return { admins: [] };
  }
};

const writeAdmins = (data) => {
  fs.writeFileSync(adminPath, JSON.stringify(data, null, 2));
};

module.exports = { readAdmins, writeAdmins };