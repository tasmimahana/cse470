const Booking = require("../models/booking");
const Pet = require("../models/pet");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NotificationService = require("../utils/notificationService");



// Get all bookings (admin only)
const getAllBookings = async (req, res) => {
  try {
    const { serviceType, status } = req.query;

    let queryObject = {};
    if (serviceType) queryObject.serviceType = serviceType;
    if (status) queryObject.status = status;

    const bookings = await Booking.find(queryObject)
      .populate("user", "name email")
      .populate("pet", "name species breed")
      .sort("-createdAt");

    console.log(`Found ${bookings.length} bookings with query:`, queryObject);

    res.status(StatusCodes.OK).json({
      data: bookings,
      count: bookings.length,
      message: "Bookings retrieved successfully"
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to retrieve bookings",
      details: error.message
    });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  const { id: bookingId } = req.params;

  const booking = await Booking.findOne({ _id: bookingId })
    .populate("user", "name email")
    .populate("pet", "name species breed");

  if (!booking) {
    throw new CustomError.NotFoundError(`No booking with id: ${bookingId}`);
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    booking.user._id.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to view this booking"
    );
  }

  res.status(StatusCodes.OK).json({ booking });
};

// Create booking
const createBooking = async (req, res) => {
  const { pet: petId } = req.body;

  // Verify pet exists
  console.log(petId)
  const pet = await Pet.findOne({ _id: petId });
  if (!pet) {
    throw new CustomError.NotFoundError(`No pet with id: ${petId}`);
  }

  req.body.user = req.user.userId;

  const booking = await Booking.create(req.body);
  res.status(StatusCodes.CREATED).json({ booking });
};

// Update booking
const updateBooking = async (req, res) => {
  const { id: bookingId } = req.params;

  const booking = await Booking.findOne({ _id: bookingId }).populate("pet", "name");

  if (!booking) {
    throw new CustomError.NotFoundError(`No booking with id: ${bookingId}`);
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to update this booking"
    );
  }

  const oldStatus = booking.status;
  const updatedBooking = await Booking.findOneAndUpdate(
    { _id: bookingId },
    req.body,
    { new: true, runValidators: true }
  ).populate("pet", "name species breed");

  // Send notification if admin changed the status
  if (req.user.role === "admin" && req.body.status && req.body.status !== oldStatus) {
    try {
      switch (req.body.status) {
        case "confirmed":
          await NotificationService.notifyBookingConfirmed(
            bookingId,
            booking.user,
            booking.pet.name,
            booking.serviceType,
            req.user.userId,
            req.user.name
          );
          break;
        case "cancelled":
          await NotificationService.notifyBookingCancelled(
            bookingId,
            booking.user,
            booking.pet.name,
            booking.serviceType,
            req.user.userId,
            req.user.name
          );
          break;
        case "completed":
          await NotificationService.notifyBookingCompleted(
            bookingId,
            booking.user,
            booking.pet.name,
            booking.serviceType,
            req.user.userId,
            req.user.name
          );
          break;
      }
    } catch (error) {
      console.error("Failed to send booking status notification:", error);
      // Don't fail the request if notification fails
    }
  }

  res.status(StatusCodes.OK).json({ booking: updatedBooking });
};

// Cancel booking
const cancelBooking = async (req, res) => {
  const { id: bookingId } = req.params;

  const booking = await Booking.findOne({ _id: bookingId });

  if (!booking) {
    throw new CustomError.NotFoundError(`No booking with id: ${bookingId}`);
  }

  // Check permissions
  if (
    req.user.role !== "admin" &&
    booking.user.toString() !== req.user.userId
  ) {
    throw new CustomError.UnauthorizedError(
      "Not authorized to cancel this booking"
    );
  }

  const cancelledBooking = await Booking.findOneAndUpdate(
    { _id: bookingId },
    { status: "cancelled" },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ booking: cancelledBooking });
};

// Confirm booking (admin only)
const confirmBooking = async (req, res) => {
  const { id: bookingId } = req.params;

  const booking = await Booking.findOneAndUpdate(
    { _id: bookingId },
    { status: "confirmed" },
    { new: true, runValidators: true }
  ).populate("pet", "name").populate("user", "name");

  if (!booking) {
    throw new CustomError.NotFoundError(`No booking with id: ${bookingId}`);
  }

  // Send notification to user
  try {
    await NotificationService.notifyBookingConfirmed(
      bookingId,
      booking.user._id,
      booking.pet.name,
      booking.serviceType,
      req.user.userId,
      req.user.name
    );
  } catch (error) {
    console.error("Failed to send booking confirmation notification:", error);
    // Don't fail the request if notification fails
  }

  res.status(StatusCodes.OK).json({ booking });
};

module.exports = {
  getAllBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  confirmBooking,
};
