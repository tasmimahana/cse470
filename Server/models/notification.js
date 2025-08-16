const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["booking", "pet", "donation", "system", "admin"],
    default: "system"
  },
  read: { type: Boolean, default: false },
  metadata: {
    actionType: String, // "approved", "confirmed", "cancelled", "updated", etc.
    resourceId: mongoose.Schema.Types.ObjectId, // ID of the related resource
    resourceType: String, // "pet", "booking", "donation", etc.
    adminId: mongoose.Schema.Types.ObjectId, // ID of the admin who performed the action
    adminName: String // Name of the admin for display
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
