const mongoose = require("mongoose");

// Pharmacy Model
const pharmacySchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    location: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    phone: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Added by Safwat: availablePaymentMethods for pharmacy-specific payment method configuration
    availablePaymentMethods: [{
      method: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaymentMethod',
        required: true
      },
      details: {
        type: mongoose.Schema.Types.Mixed // e.g. { walletNumber: '01001234567' }
      }
    }],
    reviews: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pharmacy", pharmacySchema);
