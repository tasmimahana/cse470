const mongoose = require("mongoose");

const healthLogSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  vaccination: { type: String },
  weight: { type: Number },
  notes: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("HealthLog", healthLogSchema);
