const HealthLog = require("../models/healthLog");
const Pet = require("../models/pet");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get health logs for a pet
const getPetHealthLogs = async (req, res) => {
  const { petId } = req.params;

  // Verify pet exists and user has access
  const pet = await Pet.findOne({ _id: petId });
  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  // Check permissions - only admin or pet owner can view health logs
  if (req.user.role !== "admin" && pet.addedBy.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to view health logs for this pet"
    );
  }

  const healthLogs = await HealthLog.find({ pet: petId })
    .populate("pet", "name species breed")
    .sort("-date");

  res.status(StatusCodes.OK).json({ healthLogs, count: healthLogs.length });
};

// Get single health log
const getHealthLog = async (req, res) => {
  const { id: healthLogId } = req.params;

  const healthLog = await HealthLog.findOne({ _id: healthLogId }).populate(
    "pet",
    "name species breed addedBy"
  );

  if (!healthLog) {
    throw new CustomError.NotFoundError(
      `No health log with id: ${healthLogId}`
    );
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    healthLog.pet.addedBy.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to view this health log"
    );
  }

  res.status(StatusCodes.OK).json({ healthLog });
};

// Create health log entry
const createHealthLog = async (req, res) => {
  const { pet: petId } = req.body;

  // Verify pet exists and user has access
  const pet = await Pet.findOne({ _id: petId });
  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  // Check permissions - only admin or pet owner can create health logs
  if (req.user.role !== "admin" && pet.addedBy.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to create health logs for this pet"
    );
  }

  const healthLog = await HealthLog.create(req.body);
  res.status(StatusCodes.CREATED).json({ healthLog });
};

// Update health log
const updateHealthLog = async (req, res) => {
  const { id: healthLogId } = req.params;

  const healthLog = await HealthLog.findOne({ _id: healthLogId }).populate(
    "pet",
    "addedBy"
  );

  if (!healthLog) {
    throw new CustomError.NotFoundError(
      `No health log with id: ${healthLogId}`
    );
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    healthLog.pet.addedBy.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to update this health log"
    );
  }

  const updatedHealthLog = await HealthLog.findOneAndUpdate(
    { _id: healthLogId },
    req.body,
    { new: true, runValidators: true }
  ).populate("pet", "name species breed");

  res.status(StatusCodes.OK).json({ healthLog: updatedHealthLog });
};

// Delete health log
const deleteHealthLog = async (req, res) => {
  const { id: healthLogId } = req.params;

  const healthLog = await HealthLog.findOne({ _id: healthLogId }).populate(
    "pet",
    "addedBy"
  );

  if (!healthLog) {
    throw new CustomError.NotFoundError(
      `No health log with id: ${healthLogId}`
    );
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    healthLog.pet.addedBy.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to delete this health log"
    );
  }

  await HealthLog.findOneAndDelete({ _id: healthLogId });
  res.status(StatusCodes.OK).json({ msg: "Health log removed successfully" });
};

module.exports = {
  getPetHealthLogs,
  getHealthLog,
  createHealthLog,
  updateHealthLog,
  deleteHealthLog,
};
