// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");
const adminController = require("../controllers/admin.controller");

// USERS
router.get("/users", auth, isAdmin, adminController.getAllUsers);
router.get("/users/:id", auth, isAdmin, adminController.getUserById);
router.put("/users/:id", auth, isAdmin, adminController.updateUser);
router.delete("/users/:id", auth, isAdmin, adminController.deleteUser);

// PHARMACIES
router.get("/pharmacies", auth, isAdmin, adminController.getAllPharmacies);
router.get("/pharmacies/:id", auth, isAdmin, adminController.getPharmacyById);
router.put("/pharmacies/:id", auth, isAdmin, adminController.updatePharmacy);
router.delete("/pharmacies/:id", auth, isAdmin, adminController.deletePharmacy);

// Pending registration requests
router.get("/pending-owners", auth, isAdmin, adminController.getPendingUsers);
router.post(
  "/approve-owner/:id",
  auth,
  isAdmin,
  adminController.approvePendingUser
);
router.delete(
  "/reject-owner/:id",
  auth,
  isAdmin,
  adminController.rejectPendingUser
);

module.exports = router;
