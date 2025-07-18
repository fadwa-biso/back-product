// models/UserRole.js
const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "pharmacy_owner", "admin"],
    required: true,
    unique: true,
    default: "user",
  },
});

module.exports = mongoose.model("UserRole", userRoleSchema);
