const mongoose = require("mongoose");

const trainingResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String }, // obedience, grooming, health, etc.
  videoUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrainingResource", trainingResourceSchema);
