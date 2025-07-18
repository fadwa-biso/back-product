// Added by Safwat: Order routes for order management
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const orderController = require('../controllers/order.controller');

// Get all orders for user
router.get('/', auth, orderController.getUserOrders);

// Get single order by ID
router.get('/:orderId', auth, orderController.getOrderById);

// Get orders for pharmacy owner (pharmacy dashboard)
router.get('/pharmacy/:pharmacyId', auth, orderController.getPharmacyOrders);

// Update order status (for pharmacy owners)
router.put('/:orderId/status', auth, orderController.updateOrderStatus);

// Cancel order (for users)
router.put('/:orderId/cancel', auth, orderController.cancelOrder);

// Get order statistics (for admin/pharmacy owners)
router.get('/stats/pharmacy/:pharmacyId', auth, orderController.getOrderStats);

module.exports = router; 