const Notification = require("../models/notification");

class NotificationService {
  // Create a notification for a specific user
  static async createNotification({
    userId,
    message,
    type = "system",
    actionType,
    resourceId,
    resourceType,
    adminId,
    adminName
  }) {
    try {
      const notification = await Notification.create({
        user: userId,
        message,
        type,
        metadata: {
          actionType,
          resourceId,
          resourceType,
          adminId,
          adminName
        }
      });

      console.log(`Notification created for user ${userId}: ${message}`);
      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  }

  // Pet-related notifications
  static async notifyPetApproved(petId, petName, ownerId, adminId, adminName) {
    return this.createNotification({
      userId: ownerId,
      message: `Your pet "${petName}" has been approved by admin ${adminName} and is now visible to potential adopters.`,
      type: "pet",
      actionType: "approved",
      resourceId: petId,
      resourceType: "pet",
      adminId,
      adminName
    });
  }

  static async notifyPetRejected(petId, petName, ownerId, adminId, adminName, reason = "") {
    const reasonText = reason ? ` Reason: ${reason}` : "";
    return this.createNotification({
      userId: ownerId,
      message: `Your pet "${petName}" listing has been reviewed by admin ${adminName}.${reasonText} Please check your pet listing for more details.`,
      type: "pet",
      actionType: "rejected",
      resourceId: petId,
      resourceType: "pet",
      adminId,
      adminName
    });
  }

  static async notifyBulkPetsApproved(petIds, ownerIds, adminId, adminName) {
    const notifications = [];
    for (const ownerId of ownerIds) {
      const userPetCount = petIds.filter(id =>
        // This would need to be filtered by actual pet ownership
        // For now, we'll create a general notification
        true
      ).length;

      notifications.push(
        this.createNotification({
          userId: ownerId,
          message: `Admin ${adminName} has approved ${userPetCount} of your pet listings. They are now visible to potential adopters.`,
          type: "pet",
          actionType: "bulk_approved",
          resourceId: null,
          resourceType: "pet",
          adminId,
          adminName
        })
      );
    }

    return Promise.all(notifications);
  }

  // Booking-related notifications
  static async notifyBookingConfirmed(bookingId, userId, petName, serviceType, adminId, adminName) {
    return this.createNotification({
      userId,
      message: `Your ${serviceType} booking for "${petName}" has been confirmed by admin ${adminName}. Please check your booking details for appointment information.`,
      type: "booking",
      actionType: "confirmed",
      resourceId: bookingId,
      resourceType: "booking",
      adminId,
      adminName
    });
  }

  static async notifyBookingCancelled(bookingId, userId, petName, serviceType, adminId, adminName, reason = "") {
    const reasonText = reason ? ` Reason: ${reason}` : "";
    return this.createNotification({
      userId,
      message: `Your ${serviceType} booking for "${petName}" has been cancelled by admin ${adminName}.${reasonText} Please contact us if you have any questions.`,
      type: "booking",
      actionType: "cancelled",
      resourceId: bookingId,
      resourceType: "booking",
      adminId,
      adminName
    });
  }

  static async notifyBookingCompleted(bookingId, userId, petName, serviceType, adminId, adminName) {
    return this.createNotification({
      userId,
      message: `Your ${serviceType} booking for "${petName}" has been marked as completed by admin ${adminName}. Thank you for using our services!`,
      type: "booking",
      actionType: "completed",
      resourceId: bookingId,
      resourceType: "booking",
      adminId,
      adminName
    });
  }

  // User-related notifications
  static async notifyRoleChanged(userId, newRole, adminId, adminName) {
    return this.createNotification({
      userId,
      message: `Your account role has been updated to "${newRole}" by admin ${adminName}. This may affect your access permissions.`,
      type: "admin",
      actionType: "role_changed",
      resourceId: userId,
      resourceType: "user",
      adminId,
      adminName
    });
  }

  // Donation-related notifications
  static async notifyDonationStatusUpdated(donationId, userId, amount, status, adminId, adminName) {
    let message;
    switch (status) {
      case "successful":
        message = `Your donation of $${amount} has been successfully processed by admin ${adminName}. Thank you for your generosity!`;
        break;
      case "failed":
        message = `Your donation of $${amount} could not be processed. Admin ${adminName} has updated the status. Please contact us for assistance.`;
        break;
      case "refunded":
        message = `Your donation of $${amount} has been refunded by admin ${adminName}. The refund should appear in your account within 3-5 business days.`;
        break;
      default:
        message = `Your donation of $${amount} status has been updated to "${status}" by admin ${adminName}.`;
    }

    return this.createNotification({
      userId,
      message,
      type: "donation",
      actionType: "status_updated",
      resourceId: donationId,
      resourceType: "donation",
      adminId,
      adminName
    });
  }

  // System notifications
  static async notifySystemUpdate(userId, message, adminId, adminName) {
    return this.createNotification({
      userId,
      message: `System Update from admin ${adminName}: ${message}`,
      type: "system",
      actionType: "system_update",
      resourceId: null,
      resourceType: "system",
      adminId,
      adminName
    });
  }

  // Broadcast notifications to all users
  static async broadcastToAllUsers(message, type = "system", adminId, adminName) {
    const User = require("../models/User");
    const users = await User.find({}, "_id");

    const notifications = users.map(user =>
      this.createNotification({
        userId: user._id,
        message,
        type,
        actionType: "broadcast",
        resourceId: null,
        resourceType: "system",
        adminId,
        adminName
      })
    );

    return Promise.all(notifications);
  }
}

module.exports = NotificationService;