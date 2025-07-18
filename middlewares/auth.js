const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate("user_role_id")
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userRole = user.user_role_id?.role;

    // 🩺 Attach pharmacy_id if user is a pharmacy_owner
    if (req.userRole === "pharmacy_owner") {
      const pharmacy = await Pharmacy.findOne({ owner: user._id });
      if (pharmacy) {
        req.user.pharmacy_id = pharmacy._id;
      }
      // else {
      //   return res
      //     .status(403)
      //     .json({ message: "Pharmacy not found for this user" });
      // }
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
