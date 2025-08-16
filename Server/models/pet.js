const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true }, // Dog, Cat, Bird, etc.
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female"] },
  description: { type: String },
  imageUrl: { type: String },
  status: {
    type: String,
    enum: ["available", "adopted"],
    default: "available",
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Pet", petSchema);
