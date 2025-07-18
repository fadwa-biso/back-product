// controllers/watchlist.controller.js
const User = require("../models/User");
const Product = require("../models/product.model");

// ➕ Add product to watchlist
exports.addToWatchlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId)
    return res.status(400).json({ message: "Product ID is required" });

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchlist: productId } }, // prevent duplicates
      { new: true }
    ).populate("watchlist");

    res.json({
      message: "Product added to watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add to watchlist", error: error.message });
  }
};

// ❌ Remove product from watchlist
exports.removeFromWatchlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId)
    return res.status(400).json({ message: "Product ID is required" });

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { watchlist: productId } },
      { new: true }
    ).populate("watchlist");

    res.json({
      message: "Product removed from watchlist",
      watchlist: user.watchlist,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to remove from watchlist",
        error: error.message,
      });
  }
};

// 👁️ View watchlist
exports.getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    res.json({ watchlist: user.watchlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch watchlist", error: error.message });
  }
};
