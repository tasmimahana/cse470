const TrainingResource = require("../models/trainingResource");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get all training resources
const getAllTrainingResources = async (req, res) => {
  try {
    const { category, search } = req.query;

    let queryObject = {};
    if (category) queryObject.category = category;

    // Handle search functionality
    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const resources = await TrainingResource.find(queryObject).sort("-createdAt");

    console.log(`Found ${resources.length} training resources with search: "${search}", category: "${category}"`);

    res.status(StatusCodes.OK).json({
      resources,
      count: resources.length,
      message: "Training resources retrieved successfully"
    });
  } catch (error) {
    console.error('Get training resources error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve training resources",
      details: error.message
    });
  }
};

// Get single training resource
const getTrainingResource = async (req, res) => {
  const { id: resourceId } = req.params;

  const resource = await TrainingResource.findOne({ _id: resourceId });

  if (!resource) {
    throw new CustomError.NotFoundError(
      `No training resource with id: ${resourceId}`
    );
  }

  res.status(StatusCodes.OK).json({ resource });
};

// Create training resource (admin only)
const createTrainingResource = async (req, res) => {
  const resource = await TrainingResource.create(req.body);
  res.status(StatusCodes.CREATED).json({ resource });
};

// Update training resource (admin only)
const updateTrainingResource = async (req, res) => {
  const { id: resourceId } = req.params;

  const resource = await TrainingResource.findOneAndUpdate(
    { _id: resourceId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!resource) {
    throw new CustomError.NotFoundError(
      `No training resource with id: ${resourceId}`
    );
  }

  res.status(StatusCodes.OK).json({ resource });
};

// Delete training resource (admin only)
const deleteTrainingResource = async (req, res) => {
  const { id: resourceId } = req.params;

  const resource = await TrainingResource.findOne({ _id: resourceId });

  if (!resource) {
    throw new CustomError.NotFoundError(
      `No training resource with id: ${resourceId}`
    );
  }

  await TrainingResource.findOneAndDelete({ _id: resourceId });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Training resource removed successfully" });
};

// Get training categories
const getTrainingCategories = async (req, res) => {
  const categories = await TrainingResource.distinct("category");
  res.status(StatusCodes.OK).json({ categories });
};

module.exports = {
  getAllTrainingResources,
  getTrainingResource,
  createTrainingResource,
  updateTrainingResource,
  deleteTrainingResource,
  getTrainingCategories,
};
