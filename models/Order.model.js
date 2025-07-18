const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  location: String,
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  transactionId: String,
  paymentDetails: mongoose.Schema.Types.Mixed, // for gateway response, etc.
}, { _id: false });

const totalsSchema = new mongoose.Schema({
  subtotal: Number,
  delivery: Number,
  tax: Number,
  discount: Number,
  total: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true,
  },
  items: [orderItemSchema],
  shipping: shippingSchema,
  payment: paymentSchema,
  totals: totalsSchema,
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  coupon: String,
  estimatedDelivery: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema); 