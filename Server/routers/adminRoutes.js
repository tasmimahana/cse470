const express = require("express");
const {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getPendingApprovals,
  bulkApprovePets,
} = require("../controllers/adminController");

const {
  getAllBookings,
  confirmBooking,
} = require("../controllers/bookingController");

const {
  getAllDonations,
  updateDonationStatus,
  getDonationStats,
} = require("../controllers/donationController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

// All routes require admin authentication
router.use(authenticateUser);
router.use(authorizePermissions("admin"));

// Dashboard and stats
router.route("/dashboard").get(getDashboardStats);

// User management
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUser);
router.route("/users/:id/role").patch(updateUserRole);
router.route("/users/:id").delete(deleteUser);

// Pet management
router.route("/pets/pending").get(getPendingApprovals);
router.route("/pets/bulk-approve").patch(bulkApprovePets);

// Booking management
router.route("/bookings").get(getAllBookings);
router.route("/bookings/:id/confirm").patch(confirmBooking);

// Donation management
router.route("/donations").get(getAllDonations);
router.route("/donations/stats").get(getDonationStats);
router.route("/donations/:id/status").patch(updateDonationStatus);

module.exports = router;
