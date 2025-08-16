const express = require("express");
const {
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

// User routes
router.route("/").get(authenticateUser, getUserNotifications);
router.route("/unread-count").get(authenticateUser, getUnreadCount);
router.route("/mark-all-read").patch(authenticateUser, markAllAsRead);
router.route("/:id").get(authenticateUser, getNotification);
router.route("/:id/read").patch(authenticateUser, markAsRead);
router.route("/:id").delete(authenticateUser, deleteNotification);

// Admin routes
router
  .route("/")
  .post(authenticateUser, authorizePermissions("admin"), createNotification);

module.exports = router;
