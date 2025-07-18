// middlewares/isPharmacyOwner.js

const UserRole = require("../models/UserRole");

const PharmacyOwner = async (req, res, next) => {
  try {
    // Ensure user is attached by the auth middleware
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Populate the user's role if not populated
    if (!user.user_role_id?.role) {
      await user.populate("user_role_id");
    }

    if (user.user_role_id.role !== "pharmacy_owner") {
      return res
        .status(403)
        .json({ message: "Access denied: Pharmacy owners only" });
    }

    next();
  } catch (error) {
    console.error("PharmacyOwner middleware error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = PharmacyOwner;
