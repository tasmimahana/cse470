const express = require("express");
const {
  getAllPets,
  getUserPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  approvePet,
} = require("../controllers/petController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

// Public routes
router.route("/").get(getAllPets);

// Protected routes - specific routes must come before parameterized routes
router.route("/my-pets").get(authenticateUser, getUserPets);
router.route("/").post(authenticateUser, createPet);

// Parameterized routes - these must come after specific routes
router.route("/:id").get(getPet);
router.route("/:id").patch(authenticateUser, updatePet);
router.route("/:id").delete(authenticateUser, deletePet);

// Admin only routes
router
  .route("/:id/approve")
  .patch(authenticateUser, authorizePermissions("admin"), approvePet);

module.exports = router;
