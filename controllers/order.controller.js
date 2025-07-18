// Added by Safwat: Order controller for order management
const Order = require('../models/Order.model');
const Pharmacy = require('../models/Pharmacy');

// Get all orders for the authenticated user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const orders = await Order.find({ user: userId })
      .populate('pharmacy', 'name address phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('pharmacy', 'name address phone')
      .populate('items.product', 'name image description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Get orders for pharmacy owner (pharmacy dashboard)
const getPharmacyOrders = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const userId = req.user.id;

    // Verify pharmacy ownership
    const pharmacy = await Pharmacy.findOne({ _id: pharmacyId, owner: userId });
    if (!pharmacy) {
      return res.status(403).json({ message: 'Access denied: Not pharmacy owner' });
    }

    const orders = await Order.find({ pharmacy: pharmacyId })
      .populate('user', 'name email phone')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get pharmacy orders error:', error);
    res.status(500).json({ message: 'Error fetching pharmacy orders', error: error.message });
  }
};

// Update order status (for pharmacy owners)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId).populate('pharmacy');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify pharmacy ownership
    if (order.pharmacy.owner.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: Not pharmacy owner' });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// Cancel order (for users)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if order is still pending
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
};

// Get order statistics (for admin/pharmacy owners)
const getOrderStats = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const userId = req.user.id;

    // Verify pharmacy ownership
    const pharmacy = await Pharmacy.findOne({ _id: pharmacyId, owner: userId });
    if (!pharmacy) {
      return res.status(403).json({ message: 'Access denied: Not pharmacy owner' });
    }

    const stats = await Order.aggregate([
      { $match: { pharmacy: pharmacy._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totals.total' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ pharmacy: pharmacyId });
    const totalRevenue = await Order.aggregate([
      { $match: { pharmacy: pharmacy._id, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]);

    res.status(200).json({
      stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Error fetching order statistics', error: error.message });
  }
};

module.exports = {
  getUserOrders,
  getOrderById,
  getPharmacyOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
}; 