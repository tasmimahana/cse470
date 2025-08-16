const express = require("express");

const {
  getCurrentUser,
  updateUser,
  updateUserPassword,
  getUserDashboard,
} = require("../controllers/userController");

const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

// All routes require authentication
router.use(authenticateUser);

router.route("/profile").get(getCurrentUser);
router.route("/profile").patch(updateUser);
router.route("/password").patch(updateUserPassword);
router.route("/dashboard").get(getUserDashboard);

module.exports = router;
