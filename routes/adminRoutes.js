const express = require("express");
const router = express.Router();

const {
  loginAdmin,
  registerAdmin,
  updateAdmin
} = require("../controllers/adminController");

const protectAdmin = require("../middleware/authMiddleware");

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.put("/update", protectAdmin, updateAdmin);

module.exports = router;
