const jwt = require("jsonwebtoken");

// Generate Access Token (short-lived)
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET || "your_jwt_secret_key_here",
    { expiresIn: "7d" }
  );
};

// Generate Refresh Token (longer-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id }, 
    process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret_here", 
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
