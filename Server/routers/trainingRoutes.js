const express = require("express");
const {
  getAllTrainingResources,
  getTrainingResource,
  createTrainingResource,
  updateTrainingResource,
  deleteTrainingResource,
  getTrainingCategories,
} = require("../controllers/trainingController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const router = express.Router();

// Public routes
router.route("/").get(getAllTrainingResources);
router.route("/categories").get(getTrainingCategories);
router.route("/:id").get(getTrainingResource);

// Admin only routes
router
  .route("/")
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    createTrainingResource
  );
router
  .route("/:id")
  .patch(
    authenticateUser,
    authorizePermissions("admin"),
    updateTrainingResource
  );
router
  .route("/:id")
  .delete(
    authenticateUser,
    authorizePermissions("admin"),
    deleteTrainingResource
  );

module.exports = router;
