// routes/notification.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const notificationController = require("../controllers/notification.controller");

router.use(auth);

router.get("/", notificationController.getMyNotifications);
router.patch(
  "/:id/mark-as-seen",
  notificationController.markNotificationAsSeen
);
router.patch(
  "/mark-all-as-seen",
  notificationController.markAllNotificationsAsSeen
);
router.delete("/:id", notificationController.deleteNotification); // optional

module.exports = router;
