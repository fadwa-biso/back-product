// admin.controller.js
const User = require("../models/User");
const Pharmacy = require("../models/Pharmacy");
const UserRole = require("../models/UserRole");
const PendingUser = require("../models/PendingUser");

// ─── USERS ───────────────────────────────────────────────

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("user_role_id", "role");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "user_role_id",
      "role"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: error.message });
  }
};

// ─── PHARMACIES ───────────────────────────────────────────

// Get all pharmacies
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().populate("owner", "name email");
    res.json(pharmacies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch pharmacies", error: error.message });
  }
};

// Get pharmacy by ID
exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch pharmacy", error: error.message });
  }
};

// Update pharmacy
exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });
    res.json({ message: "Pharmacy updated", pharmacy });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update pharmacy", error: error.message });
  }
};

// Delete pharmacy
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });
    res.json({ message: "Pharmacy deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete pharmacy", error: error.message });
  }
};

// ─── PENDING PHARMACY OWNER REGISTRATIONS ─────────────────

// View all pending pharmacy_owner registrations
exports.getPendingUsers = async (req, res) => {
  const requests = await PendingUser.find();
  res.json(requests);
};

// Approve a pharmacy_owner registration
exports.approvePendingUser = async (req, res) => {
  const pending = await PendingUser.findById(req.params.id);
  if (!pending)
    return res.status(404).json({ message: "Pending request not found" });

  const userRole = await UserRole.findOne({ role: pending.role });

  const user = new User({
    name: pending.name,
    email: pending.email,
    password: pending.password,
    phone: pending.phone,
    user_role_id: userRole._id,
    approved: true,
  });

  await user.save();
  await pending.deleteOne();

  res.json({ message: "User approved and created", user });
};

// Reject a pending registration
exports.rejectPendingUser = async (req, res) => {
  const pending = await PendingUser.findByIdAndDelete(req.params.id);
  if (!pending)
    return res.status(404).json({ message: "Pending request not found" });
  res.json({ message: "Registration request rejected" });
};
