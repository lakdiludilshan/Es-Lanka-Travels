const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    destination: { type: String, required: true },
    travelDates: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    travelers: { type: Number, required: true },
    tripStyles: [{ type: String }], // Adventure, Relaxation, etc.
    activities: [{ type: String }], // Hiking, Snorkeling, etc.
    budgetRange: { type: String, enum: ["$", "$$", "$$$"], required: true },
    accommodation: { type: String },
    transport: { type: String },
    foodPreferences: [{ type: String }], // Vegan, Street Food, etc.
    specialRequests: [{ type: String }], // Kid-Friendly, Accessibility
  },
  { timestamps: true }
);

const Preference = mongoose.model("Preference", preferenceSchema);

module.exports = Preference;