const express = require("express");
const {
  getPetHealthLogs,
  getHealthLog,
  createHealthLog,
  updateHealthLog,
  deleteHealthLog,
} = require("../controllers/healthController");

const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();

// All routes require authentication
router.route("/pet/:petId").get(authenticateUser, getPetHealthLogs);
router.route("/").post(authenticateUser, createHealthLog);
router.route("/:id").get(authenticateUser, getHealthLog);
router.route("/:id").patch(authenticateUser, updateHealthLog);
router.route("/:id").delete(authenticateUser, deleteHealthLog);

module.exports = router;
