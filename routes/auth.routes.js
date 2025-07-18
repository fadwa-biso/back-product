const express = require("express");
const {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  registerUser,
  resetPassword,
  checkEmail,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh-token", refreshTokenHandler);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);
router.post("/check-email", checkEmail);

module.exports = router;
