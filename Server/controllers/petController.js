const Pet = require("../models/pet");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NotificationService = require("../utils/notificationService");

// Get all pets (with optional filtering)
const getAllPets = async (req, res) => {
  const { status, species, approved } = req.query;

  let queryObject = {};

  if (status) queryObject.status = status;
  if (species) queryObject.species = species;
  if (approved !== undefined) queryObject.approved = approved === "true";

  const pets = await Pet.find(queryObject)
    .populate("addedBy", "name email")
    .sort("-createdAt");

  res.status(StatusCodes.OK).json({ pets, count: pets.length });
};

// Get user's pets
const getUserPets = async (req, res) => {
  try {
    console.log('getUserPets called for user:', req.user.userId);

    const pets = await Pet.find({ addedBy: req.user.userId }).sort("-createdAt");

    console.log(`Found ${pets.length} pets for user ${req.user.userId}`);

    res.status(StatusCodes.OK).json({
      data: pets,
      count: pets.length,
      message: "User pets retrieved successfully"
    });
  } catch (error) {
    console.error('Get user pets error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve user pets",
      details: error.message
    });
  }
};

// Get single pet
const getPet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOne({ _id: petId }).populate(
    "addedBy",
    "name email"
  );

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  res.status(StatusCodes.OK).json({ pet });
};

// Create pet listing
const createPet = async (req, res) => {
  console.log('Creating pet for user:', req.user.userId);
  console.log('Pet data:', req.body);

  req.body.addedBy = req.user.userId;
  // Auto-approve pets for booking purposes (admin approval is for public listing)
  if (req.body.approved === undefined) {
    req.body.approved = true;
  }

  const pet = await Pet.create(req.body);
  console.log('Created pet:', { id: pet._id, name: pet.name, addedBy: pet.addedBy, approved: pet.approved });

  res.status(StatusCodes.CREATED).json({ pet });
};

// Update pet
const updatePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOne({ _id: petId });

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  // Check permissions - only admin or pet owner can update
  if (req.user.role !== "admin" && pet.addedBy.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to update this pet"
    );
  }

  const updatedPet = await Pet.findOneAndUpdate({ _id: petId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ pet: updatedPet });
};

// Delete pet
const deletePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOne({ _id: petId });

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  // Check permissions - only admin or pet owner can delete
  if (req.user.role !== "admin" && pet.addedBy.toString() !== req.user.userId) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to delete this pet"
    );
  }

  await Pet.findOneAndDelete({ _id: petId });
  res.status(StatusCodes.OK).json({ msg: "Pet removed successfully" });
};

// Admin approve pet
const approvePet = async (req, res) => {
  const { id: petId } = req.params;

  const pet = await Pet.findOneAndUpdate(
    { _id: petId },
    { approved: true },
    { new: true, runValidators: true }
  ).populate("addedBy", "name");

  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  // Send notification to pet owner
  try {
    await NotificationService.notifyPetApproved(
      pet._id,
      pet.name,
      pet.addedBy._id,
      req.user.userId,
      req.user.name
    );
  } catch (error) {
    console.error("Failed to send pet approval notification:", error);
    // Don't fail the request if notification fails
  }

  res.status(StatusCodes.OK).json({ pet });
};

module.exports = {
  getAllPets,
  getUserPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  approvePet,
};
