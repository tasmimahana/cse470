const express = require("express");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

router.get("/protected", authenticateUser, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}`, user: req.user });
});

module.exports = router;
