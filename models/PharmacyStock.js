const mongoose = require("mongoose");

const pharmacyStockSchema = new mongoose.Schema({
  pharmacy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  stock: { type: Number, default: 0 },
  notifications: [
    {
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

pharmacyStockSchema.index({ pharmacy_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("PharmacyStock", pharmacyStockSchema);
