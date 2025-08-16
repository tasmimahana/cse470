const User = require("../models/User");
const Pet = require("../models/pet");
const Booking = require("../models/booking");
const Donation = require("../models/donation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

// Get current user profile
const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select(
    "-password -verificationToken -passwordToken"
  );

  res.status(StatusCodes.OK).json({ user });
};

// Update user profile
const updateUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new CustomError.BadRequestError("Please provide name and email");
  }

  // Check if email is already taken by another user
  const existingUser = await User.findOne({
    email,
    _id: { $ne: req.user.userId },
  });

  if (existingUser) {
    throw new CustomError.BadRequestError("Email already in use");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { name, email },
    { new: true, runValidators: true }
  ).select("-password -verificationToken -passwordToken");

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// Update user password
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide old and new password"
    );
  }

  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
};

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  const userId = req.user.userId;

  const userPets = await Pet.find({ addedBy: userId });
  const userBookings = await Booking.find({ user: userId })
    .populate("pet", "name species breed")
    .sort("-createdAt")
    .limit(5);
  const userDonations = await Donation.find({ user: userId })
    .sort("-createdAt")
    .limit(5);

  const stats = {
    totalPets: userPets.length,
    availablePets: userPets.filter((pet) => pet.status === "available").length,
    adoptedPets: userPets.filter((pet) => pet.status === "adopted").length,
    totalBookings: userBookings.length,
    totalDonations: userDonations.length,
    totalDonationAmount: userDonations
      .filter((d) => d.paymentStatus === "successful")
      .reduce((sum, d) => sum + d.amount, 0),
  };

  res.status(StatusCodes.OK).json({
    stats,
    recentPets: userPets.slice(0, 5),
    recentBookings: userBookings,
    recentDonations: userDonations,
  });
};

module.exports = {
  getCurrentUser,
  updateUser,
  updateUserPassword,
  getUserDashboard,
};
