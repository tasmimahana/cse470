const Notification = require("../models/notification");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

// Get user notifications
const getUserNotifications = async (req, res) => {
  const { read } = req.query;

  let queryObject = { user: req.user.userId };
  if (read !== undefined) queryObject.read = read === "true";

  const notifications = await Notification.find(queryObject).sort("-createdAt");

  res
    .status(StatusCodes.OK)
    .json({ data: notifications, count: notifications.length });
};

// Get single notification
const getNotification = async (req, res) => {
  const { id: notificationId } = req.params;

  const notification = await Notification.findOne({
    _id: notificationId,
    user: req.user.userId,
  });

  if (!notification) {
    throw new CustomError.NotFoundError(
      `No notification with id: ${notificationId}`
    );
  }

  res.status(StatusCodes.OK).json({ notification });
};

// Create notification (admin only)
const createNotification = async (req, res) => {
  const { broadcast, ...notificationData } = req.body;

  if (broadcast) {
    // Broadcast to all users
    const User = require("../models/User");
    const users = await User.find({}, "_id");

    const notifications = await Promise.all(
      users.map(user =>
        Notification.create({
          ...notificationData,
          user: user._id,
          metadata: {
            ...notificationData.metadata,
            adminId: req.user.userId,
            adminName: req.user.name,
            actionType: "broadcast"
          }
        })
      )
    );

    res.status(StatusCodes.CREATED).json({
      message: `Notification sent to ${notifications.length} users`,
      count: notifications.length
    });
  } else {
    // Single notification
    const notification = await Notification.create({
      ...notificationData,
      metadata: {
        ...notificationData.metadata,
        adminId: req.user.userId,
        adminName: req.user.name
      }
    });
    res.status(StatusCodes.CREATED).json({ notification });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  const { id: notificationId } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: req.user.userId },
    { read: true },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new CustomError.NotFoundError(
      `No notification with id: ${notificationId}`
    );
  }

  res.status(StatusCodes.OK).json({ notification });
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user.userId, read: false },
    { read: true }
  );

  res.status(StatusCodes.OK).json({ msg: "All notifications marked as read" });
};

// Delete notification
const deleteNotification = async (req, res) => {
  const { id: notificationId } = req.params;

  const notification = await Notification.findOne({
    _id: notificationId,
    user: req.user.userId,
  });

  if (!notification) {
    throw new CustomError.NotFoundError(
      `No notification with id: ${notificationId}`
    );
  }

  await Notification.findOneAndDelete({ _id: notificationId });
  res.status(StatusCodes.OK).json({ msg: "Notification removed successfully" });
};

// Get unread count
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user.userId,
    read: false,
  });

  res.status(StatusCodes.OK).json({ unreadCount: count });
};

module.exports = {
  getUserNotifications,
  getNotification,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
