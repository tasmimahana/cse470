const express = require("express");
const {
  login,
  logout,
  register,
  verifyEmail,
  testAuth,
  resendVerificationEmail,
} = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
router.get("/test", authenticateUser, testAuth);

module.exports = router;
