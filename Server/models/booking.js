const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  serviceType: {
    type: String,
    enum: ["veterinary", "daycare", "grooming", "training"],
    required: true,
  },
  providerName: { type: String }, // Vet or service provider name
  date: { type: Date, required: true },
  notes: { type: String }, // Additional notes or requirements
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
