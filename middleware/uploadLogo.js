const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "store-logo/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only PNG allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;