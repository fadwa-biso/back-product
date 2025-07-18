// middlewares/isAdmin.js
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Populate the role if not already populated
    if (!req.user.user_role_id?.role) {
      await req.user.populate("user_role_id");
    }

    if (req.user.user_role_id.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    next();
  } catch (err) {
    console.error("isAdmin middleware error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = isAdmin;
