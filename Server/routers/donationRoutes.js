const express = require("express");
const {
  getAllDonations,
  getDonation,
  createDonation,
  updateDonationStatus,
  getDonationStats,
} = require("../controllers/donationController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

// User routes
router.route("/").post(authenticateUser, createDonation);
router.route("/:id").get(authenticateUser, getDonation);

// Admin routes
router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllDonations);
router
  .route("/stats")
  .get(authenticateUser, authorizePermissions("admin"), getDonationStats);
router
  .route("/:id/status")
  .patch(authenticateUser, authorizePermissions("admin"), updateDonationStatus);

module.exports = router;
