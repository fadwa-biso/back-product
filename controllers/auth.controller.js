//auth.controller.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const PendingUser = require("../models/PendingUser");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokens");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const existingPending = await PendingUser.findOne({ email });

    if (existingUser || existingPending) {
      return res
        .status(409)
        .json({ message: "Email already registered or pending" });
    }

    const hashedPassword = await bcrypt.hash(password, +(process.env.SALT_ROUND || 10));

    if (role === "pharmacy_owner") {
      const pending = new PendingUser({
        name,
        email,
        password: hashedPassword,
        phone,
        role,
      });
      await pending.save();
      return res
        .status(201)
        .json({ message: "Registration pending admin approval" });
    }

    const userRole = await UserRole.findOne({ role });
    if (!userRole)
      return res.status(400).json({ message: "Invalid role provided" });

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      user_role_id: userRole._id,
      approved: true, // Default for normal users
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save();

    res.status(201).json({
      message: "Registration successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration error", error: error.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // First, check for a pending user with the provided email
    const pendingUser = await PendingUser.findOne({ email }).populate("role");
    if (pendingUser) {
      // If the pending user exists and has not been approved, return an error message
      if (!pendingUser.approved) {
        return res.status(403).json({ message: "Awaiting admin approval" });
      }
    }

    // Now, check for an actual user with the provided email
    const user = await User.findOne({ email }).populate("user_role_id");
    if (!user) {
      // If no user is found, return Invalid credentials message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, return Invalid credentials message
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store the tokens in the user object
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save();

    // Send response with user details and tokens
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.user_role_id?.role || "unknown",
      },
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

// Refresh Token
exports.refreshTokenHandler = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token missing" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret");
    const user = await User.findById(payload.userId);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    user.accessToken = newAccessToken;
    await user.save();

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = otp;
    user.resetOTPExpires = expiry;
    await user.save();

    await sendEmail(
      email,
      "Password Reset OTP",
      `<p>Your OTP code is <strong>${otp}</strong>. It expires in 10 minutes.</p>`
    );

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.resetOTP || !user.resetOTPExpires)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (user.resetOTP !== otp)
      return res.status(400).json({ message: "Incorrect OTP" });

    if (user.resetOTPExpires < new Date())
      return res.status(400).json({ message: "OTP expired" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Reset failed", error: error.message });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout error", error: error.message });
  }
};

exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const existingUser = await User.findOne({ email });
    const existingPending = await PendingUser.findOne({ email });
    if (existingUser || existingPending) {
      return res
        .status(409)
        .json({ message: "Email already registered or pending" });
    }
    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error checking email", error: error.message });
  }
};
