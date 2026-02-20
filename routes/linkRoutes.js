const express = require("express");
const router = express.Router();
const { trackClick } = require("../controllers/linkController");
const {
  getLinks,
  addLink,
  deleteLink
} = require("../controllers/linkController");
const protectAdmin = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadLogo");

router.get("/", getLinks);
router.post("/add", protectAdmin, upload.single("logo"), addLink);
router.post("/click/:id", trackClick);
router.delete("/:id", protectAdmin, deleteLink);

module.exports = router;