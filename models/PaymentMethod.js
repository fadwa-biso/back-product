// Added by Safwat: PaymentMethod model for managing payment types
const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. 'vodafone_cash', 'cash', 'visa'
  name: { type: String, required: true } // e.g. 'Vodafone Cash', 'Cash', 'Visa'
});

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema); 