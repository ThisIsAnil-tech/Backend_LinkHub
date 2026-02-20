const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    profileLink: {
      type: String,
      required: true
    },
    logoUrl: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Link", linkSchema);
