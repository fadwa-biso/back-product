const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const isPharmacyOwner = require("../middlewares/isPharmacyOwner");
const {
  addStock,
  updateStockQuantity,
  decreaseStock,
  getMyStock,
  checkProductAvailability,
  getStockByProductId,
  deleteStockEntry,
} = require("../controllers/pharmacyStock.controller");

// 🔒 Protected routes (Pharmacy Owner Only)
router.post("/", auth, isPharmacyOwner, addStock); // Add new stock
router.put("/", auth, isPharmacyOwner, updateStockQuantity); // Update quantity manually
router.patch("/decrease", auth, isPharmacyOwner, decreaseStock); // After sale
router.get("/", auth, isPharmacyOwner, getMyStock); // Get stock of logged-in pharmacy
router.get("/product/:productId", auth, isPharmacyOwner, getStockByProductId); // Get stock info for a specific product

// 🟢 Public route
router.get("/check/:productId", checkProductAvailability); // Check availability
router.delete("/:productId", auth, isPharmacyOwner, deleteStockEntry); // Delete stock entry

module.exports = router;
