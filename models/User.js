// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    user_role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRole",
      required: true,
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    notifications: [
      {
        message: String,
        seen: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    accessToken: {
      type: String,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    resetOTP: {
      type: String,
    },

    resetOTPExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
