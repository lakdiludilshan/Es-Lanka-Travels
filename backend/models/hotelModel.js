const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String, // e.g., Luxury, Budget, Boutique, etc.
    },
    imageUrls: [
      {
        type: String,
      },
    ],
    amenities: [
      {
        type: String,
      },
    ],
    ratings: {
      averageRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
    },
    contactInfo: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    pricing: {
      normal: { type: Number, required: true }, // e.g., 100
      deluxe: { type: Number, required: true }, // e.g., 150
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
