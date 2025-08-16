const User = require("../models/User");
const Pet = require("../models/pet");
const Booking = require("../models/booking");
const Donation = require("../models/donation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NotificationService = require("../utils/notificationService");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get all users count (including admins)
    const totalUsers = await User.countDocuments();
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({
      status: "available",
      approved: true,
    });
    const adoptedPets = await Pet.countDocuments({ status: "adopted" });
    const pendingApprovals = await Pet.countDocuments({ approved: false });

    const totalBookings = await Booking.countDocuments();
    const activeBookings = await Booking.countDocuments({
      status: { $in: ["pending", "confirmed"] }
    });
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    // Get total donations amount
    const totalDonationsResult = await Donation.aggregate([
      { $match: { paymentStatus: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get monthly revenue (current month)
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const monthlyRevenueResult = await Donation.aggregate([
      {
        $match: {
          paymentStatus: "successful",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Calculate growth percentages (simplified - you can enhance this with historical data)
    const userGrowth = Math.floor(Math.random() * 20); // Mock growth for now
    const petGrowth = Math.floor(Math.random() * 15);
    const donationGrowth = Math.floor(Math.random() * 25);
    const bookingGrowth = Math.floor(Math.random() * 10);
    const revenueGrowth = Math.floor(Math.random() * 18);

    const stats = {
      totalUsers,
      totalPets,
      availablePets,
      adoptedPets,
      pendingApprovals,
      totalBookings,
      activeBookings,
      pendingBookings,
      confirmedBookings,
      totalDonations: totalDonationsResult[0]?.total || 0,
      monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
      userGrowth,
      petGrowth,
      donationGrowth,
      bookingGrowth,
      revenueGrowth
    };

    console.log('Dashboard stats calculated:', stats);

    res.status(StatusCodes.OK).json({
      data: stats,
      message: "Dashboard statistics retrieved successfully"
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve dashboard statistics",
      details: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { role, isVerified, limit } = req.query;

    let queryObject = {};
    if (role) queryObject.role = role;
    if (isVerified !== undefined) queryObject.isVerified = isVerified === "true";

    let query = User.find(queryObject)
      .select("-password -verificationToken -passwordToken")
      .sort("-createdAt");

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const users = await query;

    console.log(`Found ${users.length} users with query:`, queryObject);

    res.status(StatusCodes.OK).json({
      data: users,
      count: users.length,
      message: "Users retrieved successfully"
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve users",
      details: error.message
    });
  }
};

// Get single user
const getUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId }).select(
    "-password -verificationToken -passwordToken"
  );

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }

  // Get user's pets and bookings
  const userPets = await Pet.find({ addedBy: userId });
  const userBookings = await Booking.find({ user: userId }).populate(
    "pet",
    "name species breed"
  );
  const userDonations = await Donation.find({ user: userId });

  res.status(StatusCodes.OK).json({
    user,
    userPets,
    userBookings,
    userDonations,
  });
};

// Update user role
const updateUserRole = async (req, res) => {
  const { id: userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    throw new CustomError.BadRequestError("Invalid role");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { role },
    { new: true, runValidators: true }
  ).select("-password -verificationToken -passwordToken");

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }

  // Send notification to user about role change
  try {
    await NotificationService.notifyRoleChanged(
      userId,
      role,
      req.user.userId,
      req.user.name
    );
  } catch (error) {
    console.error("Failed to send role change notification:", error);
    // Don't fail the request if notification fails
  }

  res.status(StatusCodes.OK).json({ user });
};

// Delete user
const deleteUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${userId}`);
  }

  // Don't allow deleting admin users
  if (user.role === "admin") {
    throw new CustomError.BadRequestError("Cannot delete admin users");
  }

  await User.findOneAndDelete({ _id: userId });
  res.status(StatusCodes.OK).json({ msg: "User removed successfully" });
};

// Get pending pet approvals
const getPendingApprovals = async (req, res) => {
  try {
    const pendingPets = await Pet.find({ approved: false })
      .populate("addedBy", "name email")
      .sort("-createdAt");

    // Transform the data to match frontend expectations
    const transformedPets = pendingPets.map(pet => ({
      ...pet.toObject(),
      owner: pet.addedBy // Map addedBy to owner for frontend compatibility
    }));

    console.log(`Found ${pendingPets.length} pending pets`);

    res.status(StatusCodes.OK).json({
      data: transformedPets,
      count: transformedPets.length,
      message: "Pending pets retrieved successfully"
    });
  } catch (error) {
    console.error('Get pending pets error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve pending pets",
      details: error.message
    });
  }
};

// Bulk approve pets
const bulkApprovePets = async (req, res) => {
  const { petIds } = req.body;

  if (!Array.isArray(petIds) || petIds.length === 0) {
    throw new CustomError.BadRequestError("Please provide an array of pet IDs");
  }

  // Get pets with owner information before updating
  const pets = await Pet.find({ _id: { $in: petIds } }).populate("addedBy", "name");

  const result = await Pet.updateMany(
    { _id: { $in: petIds } },
    { approved: true }
  );

  // Send notifications to pet owners
  try {
    const notificationPromises = pets.map(pet =>
      NotificationService.notifyPetApproved(
        pet._id,
        pet.name,
        pet.addedBy._id,
        req.user.userId,
        req.user.name
      )
    );

    await Promise.all(notificationPromises);
  } catch (error) {
    console.error("Failed to send bulk approval notifications:", error);
    // Don't fail the request if notifications fail
  }

  res.status(StatusCodes.OK).json({
    msg: `${result.modifiedCount} pets approved successfully`,
    modifiedCount: result.modifiedCount,
  });
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getPendingApprovals,
  bulkApprovePets,
};
