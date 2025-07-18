// controllers/notification.controller.js
const User = require("../models/User");

// Get all my notifications (sorted by newest first)
exports.getMyNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("notifications");
    const notifications = user.notifications.sort(
      (a, b) => b.createdAt - a.createdAt
    );
    res.json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications", error: err.message });
  }
};

// Mark one notification as seen
exports.markNotificationAsSeen = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const notification = user.notifications.id(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.seen = true;
    await user.save();

    res.json({ message: "Notification marked as seen" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error marking as seen", error: err.message });
  }
};

// Mark all notifications as seen
exports.markAllNotificationsAsSeen = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.notifications.forEach((n) => (n.seen = true));
    await user.save();

    res.json({ message: "All notifications marked as seen" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error marking all as seen", error: err.message });
  }
};

// (Optional) Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const notification = user.notifications.id(req.params.id);
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.deleteOne();
    await user.save();

    res.json({ message: "Notification deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting notification", error: err.message });
  }
};
