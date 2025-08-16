const express = require("express");
const {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  confirmBooking,
} = require("../controllers/bookingController");

const { authenticateUser, authorizePermissions } = require("../middleware/authentication");

const router = express.Router();

// User routes
router.route("/").post(authenticateUser, createBooking);
router.route("/:id").get(authenticateUser, getBooking);
router.route("/:id").patch(authenticateUser, updateBooking);
router.route("/:id/cancel").patch(authenticateUser, cancelBooking);

// Admin routes
router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllBookings);
router
  .route("/:id/confirm")
  .patch(authenticateUser, authorizePermissions("admin"), confirmBooking);

module.exports = router;
