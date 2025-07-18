const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
} = require("../controllers/watchlist.controller");

router.use(auth); // All routes require authentication

router.get("/", getWatchlist); // View watchlist
router.post("/add", addToWatchlist); // Add to watchlist
router.delete("/remove", removeFromWatchlist); // Remove from watchlist

module.exports = router;
