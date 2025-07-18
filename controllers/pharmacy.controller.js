// controllers/pharmacy.controller.js
const Pharmacy = require("../models/Pharmacy");

// Create a pharmacy (Pharmacy Owner only)
exports.createPharmacy = async (req, res) => {
  try {
    const { name, address, location, coordinates, phone } = req.body;

    const newPharmacy = new Pharmacy({
      name,
      address,
      location,
      coordinates,
      phone,
      owner: req.user._id,
    });

    await newPharmacy.save();
    res
      .status(201)
      .json({ message: "Pharmacy created", pharmacy: newPharmacy });
  } catch (error) {
    console.error("Create Pharmacy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all pharmacies (Public)
exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().populate("owner", "name email");
    res.status(200).json(pharmacies);
  } catch (error) {
    console.error("Get Pharmacies Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single pharmacy by ID (Public)
exports.getPharmacyById = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id).populate(
      "owner",
      "name email"
    );
    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }
    res.status(200).json(pharmacy);
  } catch (error) {
    console.error("Get Pharmacy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update pharmacy (Pharmacy Owner only)
exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    if (pharmacy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, address, location, coordinates, phone } = req.body;

    pharmacy.name = name || pharmacy.name;
    pharmacy.address = address || pharmacy.address;
    pharmacy.location = location || pharmacy.location;
    pharmacy.coordinates = coordinates || pharmacy.coordinates;
    pharmacy.phone = phone || pharmacy.phone;

    await pharmacy.save();

    res.status(200).json({ message: "Pharmacy updated", pharmacy });
  } catch (error) {
    console.error("Update Pharmacy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete pharmacy (Pharmacy Owner only)
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({ message: "Pharmacy not found" });
    }

    if (pharmacy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await pharmacy.deleteOne();

    res.status(200).json({ message: "Pharmacy deleted" });
  } catch (error) {
    console.error("Delete Pharmacy Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
