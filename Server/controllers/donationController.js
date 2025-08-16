const Donation = require("../models/donation");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NotificationService = require("../utils/notificationService");



// Get all donations (admin only)
const getAllDonations = async (req, res) => {
  try {
    const { paymentStatus, cause, search } = req.query;

    let queryObject = {};
    if (paymentStatus) queryObject.paymentStatus = paymentStatus;
    if (cause) queryObject.cause = { $regex: cause, $options: "i" };

    let donations;
    if (search) {
      // When searching, we need to use aggregation to search in populated fields
      const matchConditions = {};

      // Add non-search filters
      if (paymentStatus) matchConditions.paymentStatus = paymentStatus;
      if (cause) matchConditions.cause = { $regex: cause, $options: "i" };

      // Build search conditions
      const searchConditions = [
        { cause: { $regex: search, $options: "i" } },
        { "user.name": { $regex: search, $options: "i" } },
        { "user.email": { $regex: search, $options: "i" } }
      ];

      donations = await Donation.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $match: {
            ...matchConditions,
            $or: searchConditions
          }
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            cause: 1,
            paymentStatus: 1,
            createdAt: 1,
            updatedAt: 1,
            "user._id": 1,
            "user.name": 1,
            "user.email": 1
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
    } else {
      // Regular query without search
      donations = await Donation.find(queryObject)
        .populate("user", "name email")
        .sort("-createdAt");
    }

    console.log(`Found ${donations.length} donations with search: "${search}", filters:`, { paymentStatus, cause });

    res.status(StatusCodes.OK).json({
      data: donations,
      count: donations.length,
      message: "Donations retrieved successfully"
    });
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve donations",
      details: error.message
    });
  }
};

// Get single donation
const getDonation = async (req, res) => {
  const { id: donationId } = req.params;

  const donation = await Donation.findOne({ _id: donationId }).populate(
    "user",
    "name email"
  );

  if (!donation) {
    throw new CustomError.NotFoundError(`No donation with id: ${donationId}`);
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    donation.user._id.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to view this donation"
    );
  }

  res.status(StatusCodes.OK).json({ donation });
};

// Create donation
const createDonation = async (req, res) => {
  req.body.user = req.user.userId;

  const donation = await Donation.create(req.body);
  res.status(StatusCodes.CREATED).json({ donation });
};

// Update donation status (admin only)
const updateDonationStatus = async (req, res) => {
  const { id: donationId } = req.params;
  const { paymentStatus } = req.body;

  const donation = await Donation.findOneAndUpdate(
    { _id: donationId },
    { paymentStatus },
    { new: true, runValidators: true }
  ).populate("user", "name");

  if (!donation) {
    throw new CustomError.NotFoundError(`No donation with id: ${donationId}`);
  }

  // Send notification to user about donation status change
  try {
    await NotificationService.notifyDonationStatusUpdated(
      donationId,
      donation.user._id,
      donation.amount,
      paymentStatus,
      req.user.userId,
      req.user.name
    );
  } catch (error) {
    console.error("Failed to send donation status notification:", error);
    // Don't fail the request if notification fails
  }

  res.status(StatusCodes.OK).json({ donation });
};

// Get donation statistics (admin only)
const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { paymentStatus: "successful" } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const donationsByCause = await Donation.aggregate([
      { $match: { paymentStatus: "successful" } },
      {
        $group: { _id: "$cause", total: { $sum: "$amount" }, count: { $sum: 1 } },
      },
      { $sort: { total: -1 } },
    ]);

    const monthlyDonations = await Donation.aggregate([
      { $match: { paymentStatus: "successful" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    const stats = {
      totalDonations: totalDonations[0] || { total: 0, count: 0 },
      donationsByCause,
      monthlyDonations,
    };

    console.log('Donation stats calculated:', stats);

    res.status(StatusCodes.OK).json({
      data: stats,
      message: "Donation statistics retrieved successfully"
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve donation statistics",
      details: error.message
    });
  }
};

module.exports = {
  getAllDonations,
  getDonation,
  createDonation,
  updateDonationStatus,
  getDonationStats,
};
