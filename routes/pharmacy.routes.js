// routes/pharmacy.routes.js
const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const PharmacyOwner = require("../middlewares/isPharmacyOwner");
const {
  createPharmacy,
  getAllPharmacies,
  getPharmacyById,
  updatePharmacy,
  deletePharmacy,
} = require("../controllers/pharmacy.controller");

// 🟢 Public Routes
router.get("/", getAllPharmacies); // Get all pharmacies
router.get("/:id", getPharmacyById); // Get pharmacy by ID

// 🔒 Protected Routes (Pharmacy Owner only)
router.post("/", auth, PharmacyOwner, createPharmacy); // Create pharmacy
router.put("/:id", auth, PharmacyOwner, updatePharmacy); // Update pharmacy
router.delete("/:id", auth, PharmacyOwner, deletePharmacy); // Delete pharmacy

module.exports = router;
